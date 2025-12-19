import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1615937662601-4724eceda00f?w=100&h=100&fit=crop';

export const CartSheet = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-heading text-xl">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" data-testid="empty-cart">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-sm mb-6">Add some delicious meat to get started!</p>
          <Link to="/">
            <Button className="rounded-full bg-primary hover:bg-primary/90">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="cart-sheet">
      <SheetHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <SheetTitle className="font-heading text-xl">Your Cart ({cart.length})</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            data-testid="clear-cart-btn"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6">
        <div className="py-4 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4 py-3" data-testid={`cart-item-${item.productId}`}>
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{item.productName}</h4>
                <p className="text-sm text-gray-500">{item.weight}</p>
                <p className="font-bold text-primary mt-1">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  data-testid={`remove-item-${item.productId}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    data-testid={`cart-decrement-${item.productId}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-sm min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    data-testid={`cart-increment-${item.productId}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="px-6 py-4 space-y-4 bg-white">
        {/* Subtotal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-primary text-xl">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout" className="block">
          <Button
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg btn-active"
            data-testid="checkout-btn"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        
        <p className="text-center text-xs text-gray-500">
          Cash on Delivery only • Free delivery on all orders
        </p>
      </div>
    </div>
  );
};

export default CartSheet;
