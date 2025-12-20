import { Link } from 'react-router-dom';
import { CheckCircle, Home, MessageCircle, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';

const WHATSAPP_NUMBER = '918603160441';

const OrderSuccessPage = () => {
  return (
    <div className="mobile-nav-padding min-h-screen bg-secondary flex items-center justify-center px-4" data-testid="order-success-page">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-3 animate-slide-up">
          Order Placed Successfully!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Thank you for your order! We've sent your order details to WhatsApp. 
          Our team will confirm your order shortly.
        </p>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-4 text-left">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-500">We'll confirm your order on WhatsApp</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Packing</p>
                <p className="text-sm text-gray-500">Your order will be hygienically packed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Delivery</p>
                <p className="text-sm text-gray-500">Fresh delivery to your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6" data-testid="whatsapp-btn">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
          </a>

          <Link to="/" className="block">
            <Button variant="outline" className="w-full rounded-full py-6 font-semibold" data-testid="continue-shopping-btn">
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <p className="text-sm text-gray-500 mt-8">
          Need help? Call us at{' '}
          <a href="tel:+918603160441" className="text-primary font-medium">
            <Phone className="w-3 h-3 inline mr-1" />
            +91 79869 55634
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
