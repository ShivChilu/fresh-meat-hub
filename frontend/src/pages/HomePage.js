import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1591978108398-fbf8f7128bf0?w=1920&h=1080&fit=crop';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free delivery on all orders in serviceable areas',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: '100% fresh & hygienically packed meat',
  },
  {
    icon: Clock,
    title: 'Same Day Delivery',
    description: 'Order before 2 PM for same day delivery',
  },
];

const CATEGORIES = ['chicken', 'mutton', 'others'];

const HomePage = () => {
  const { products, loading } = useProducts();
  
  // Get featured products (first 4 in-stock products)
  const featuredProducts = products.filter(p => p.inStock).slice(0, 4);

  return (
    <div className="mobile-nav-padding" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section relative min-h-[70vh] md:min-h-[80vh]" data-testid="hero-section">
        <img
          src={HERO_IMAGE}
          alt="Fresh Meat"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        
        <div className="hero-content text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            Premium Quality • Cash on Delivery
          </span>
          
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 animate-slide-up">
            Fresh Meat,<br />Delivered to Your Door
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience the finest quality chicken, mutton, and more. Hygienically packed and delivered fresh to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/category/chicken">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/30 btn-active" data-testid="shop-now-btn">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="tel:+918603160441">
              <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold" data-testid="call-now-btn">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-secondary hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">Choose from our premium selection</p>
            </div>
            <Link
              to="/categories"
              className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                productCount={products.filter(p => p.category === category).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white" data-testid="featured-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                  Featured Products
                </h2>
                <p className="text-gray-600">Our best-selling items</p>
              </div>
              <Link
                to="/category/chicken"
                className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 skeleton rounded w-3/4" />
                      <div className="h-4 skeleton rounded w-1/2" />
                      <div className="h-10 skeleton rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get fresh, premium quality meat delivered to your doorstep. Cash on delivery available in select areas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/category/chicken">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold btn-active" data-testid="order-now-btn">
                Order Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="https://wa.me/918603160441?text=Hi! I'd like to know more about your products." target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold" data-testid="whatsapp-btn">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Serviceable Areas */}
      <section className="py-12 md:py-16 bg-white" data-testid="serviceable-areas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-2">
              Serviceable Areas
            </h2>
            <p className="text-gray-600">We currently deliver to the following pincodes</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['144411', '144401', '144402'].map((pincode) => (
              <div
                key={pincode}
                className="px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700 font-semibold"
              >
                {pincode}
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't see your area? Call us at <a href="tel:+918603160441" className="text-primary font-medium">+91 86031 60441</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
