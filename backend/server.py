from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Ensure logs directory exists
LOGS_DIR = ROOT_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin PIN from env
ADMIN_PIN = os.environ.get('ADMIN_PIN', '4242')

# Serviceable pincodes
SERVICEABLE_PINCODES = ['500001', '500002', '500003', '500004']

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Custom middleware for logging requests
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{datetime.now(timezone.utc)} - {request.method} - {request.url.path}")
    response = await call_next(request)
    return response

# ===================== MODELS =====================

class ProductBase(BaseModel):
    name: str
    price: float
    category: str  # chicken, mutton, others
    image: Optional[str] = None
    inStock: bool = True
    weight: Optional[str] = "500g"
    description: Optional[str] = ""

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image: Optional[str] = None
    inStock: Optional[bool] = None
    weight: Optional[str] = None
    description: Optional[str] = None

class OrderItem(BaseModel):
    productId: str
    productName: str
    quantity: int
    price: float
    weight: Optional[str] = "500g"

class OrderCreate(BaseModel):
    customerName: str
    phone: str
    address: str
    pincode: str
    items: List[OrderItem]
    totalPrice: float
    paymentMode: str = "Cash on Delivery"

class Order(OrderCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "PENDING"
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderStatusUpdate(BaseModel):
    status: str

class AdminPinVerify(BaseModel):
    pin: str

class PincodeCheck(BaseModel):
    pincode: str

# ===================== ROUTES =====================

@api_router.get("/")
async def root():
    return {"message": "Fresh Meat Hub API - Welcome!"}

# ===================== PINCODE =====================

@api_router.post("/check-pincode")
async def check_pincode(data: PincodeCheck):
    is_serviceable = data.pincode in SERVICEABLE_PINCODES
    return {
        "pincode": data.pincode,
        "serviceable": is_serviceable,
        "message": "Service Available" if is_serviceable else "Not Serviceable in this area"
    }

# ===================== ADMIN =====================

@api_router.post("/admin/verify")
async def verify_admin_pin(data: AdminPinVerify):
    if data.pin == ADMIN_PIN:
        return {"success": True, "message": "Access granted"}
    raise HTTPException(status_code=401, detail="Invalid PIN")

# ===================== PRODUCTS =====================

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    await db.products.insert_one(doc)
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, update_data: ProductUpdate):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated_product

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product deleted"}

# Image upload endpoint
@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        content_type = file.content_type or 'image/jpeg'
        data_url = f"data:{content_type};base64,{base64_image}"
        return {"success": True, "imageUrl": data_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

# ===================== ORDERS =====================

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return orders

@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    # Validate pincode
    if order.pincode not in SERVICEABLE_PINCODES:
        raise HTTPException(status_code=400, detail="Pincode not serviceable")
    
    order_obj = Order(**order.model_dump())
    doc = order_obj.model_dump()
    await db.orders.insert_one(doc)
    
    # Log order to file
    log_order_to_file(order_obj)
    
    return order_obj

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status_update: OrderStatusUpdate):
    valid_statuses = ["PENDING", "PACKED", "OUT FOR DELIVERY", "COMPLETED"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return updated_order

def log_order_to_file(order: Order):
    """Log order details to logs/orders.txt using fs module equivalent"""
    try:
        log_file = LOGS_DIR / 'orders.txt'
        items_str = ", ".join([f"{item.productName} x{item.quantity}" for item in order.items])
        log_entry = f"""
=====================================
Order ID: {order.id}
Date: {order.createdAt}
Customer: {order.customerName}
Phone: {order.phone}
Address: {order.address}
Pincode: {order.pincode}
Items: {items_str}
Total: ₹{order.totalPrice}
Payment: {order.paymentMode}
Status: {order.status}
=====================================
"""
        with open(log_file, 'a') as f:
            f.write(log_entry)
        logger.info(f"Order {order.id} logged to file")
    except Exception as e:
        logger.error(f"Failed to log order: {e}")

# ===================== STATS =====================

@api_router.get("/stats")
async def get_stats():
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "PENDING"})
    completed_orders = await db.orders.count_documents({"status": "COMPLETED"})
    
    # Calculate total revenue from completed orders
    pipeline = [
        {"$match": {"status": "COMPLETED"}},
        {"$group": {"_id": None, "total": {"$sum": "$totalPrice"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "totalProducts": total_products,
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "completedOrders": completed_orders,
        "totalRevenue": total_revenue
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
