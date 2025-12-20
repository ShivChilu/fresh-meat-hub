import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePincode } from '../hooks/usePincode';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WHATSAPP_NUMBER = '918603160441';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { pincode, setPincode, isServiceable, message, checkPincode, checking } = usePincode();
  const navigate = useNavigate();
  const pincodeInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const total = getCartTotal();

  // Auto-check pincode when it changes
  useEffect(() => {
    if (pincode.length === 6) {
      checkPincode(pincode);
    }
  }, [pincode, checkPincode]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    if (errors.pincode) {
      setErrors(prev => ({ ...prev, pincode: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!pincode || pincode.length !== 6) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    } else if (!isServiceable) {
      newErrors.pincode = 'This area is not serviceable';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cart.map(item => 
      `• ${item.productName} (${item.weight}) x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🛒 *NEW ORDER - Fresh Meat Hub*

*Customer Details:*
Name: ${formData.customerName}
Phone: ${formData.phone}
Address: ${formData.address}
Pincode: ${pincode}

*Order Items:*
${itemsList}

*Total Amount: ₹${total.toFixed(2)}*
*Payment Mode: Cash on Delivery*

Please confirm this order. Thank you! 🙏`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        address: formData.address.trim(),
        pincode: pincode,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
        })),
        totalPrice: total,
        paymentMode: 'Cash on Delivery',
      };

      // Save order to backend
      await axios.post(`${API}/orders`, orderData);
      
      // Generate WhatsApp message and redirect
      const whatsappMessage = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully! Redirecting to WhatsApp...');
      
      // Redirect to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate('/order-success');
      }, 1000);

    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="mobile-nav-padding min-h-screen bg-secondary" data-testid="checkout-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-bold text-xl text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="order-summary">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Order Summary
            </h2>
            
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.weight} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-primary text-xl">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="delivery-details">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Details
            </h2>

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name *
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`rounded-lg ${errors.customerName ? 'border-red-500' : ''}`}
                  data-testid="input-name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  className={`rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                  data-testid="input-phone"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <Label htmlFor="pincode" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Pincode *
                </Label>
                <div className="relative">
                  <Input
                    id="pincode"
                    ref={pincodeInputRef}
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className={`rounded-lg pr-24 ${
                      errors.pincode ? 'border-red-500' :
                      isServiceable === true ? 'border-green-500 bg-green-50' :
                      isServiceable === false ? 'border-red-500 bg-red-50' : ''
                    }`}
                    data-testid="input-pincode"
                  />
                  {pincode.length === 6 && !checking && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-medium ${
                      isServiceable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isServiceable ? (
                        <>
                          <Check className="w-4 h-4" />
                          Available
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Not Available
                        </>
                      )}
                    </div>
                  )}
                </div>
                {message && pincode.length === 6 && (
                  <p className={`text-sm mt-1 ${isServiceable ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.pincode}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Serviceable pincodes:144411,144401,144402
                </p>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Full Address *
                </Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete delivery address (House/Flat No., Building, Street, Landmark)"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  data-testid="input-address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" data-testid="payment-info">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">💵</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">Cash on Delivery</p>
                <p className="text-sm text-green-600">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || !isServiceable}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg btn-active disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="place-order-btn"
          >
            {submitting ? (
              'Processing...'
            ) : (
              <>
                Place Order via WhatsApp
                <span className="ml-2">📱</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            By placing this order, you agree to our terms and conditions.
            Your order will be confirmed on WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
