import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Grid3X3, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import CartSheet from './CartSheet';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const cartCount = getCartItemCount();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Chicken', path: '/category/chicken', icon: Grid3X3 },
    { name: 'Mutton', path: '/category/mutton', icon: Grid3X3 },
    { name: 'Others', path: '/category/others', icon: Grid3X3 },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-testid="header-logo">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg md:text-xl">F</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-xl md:text-2xl text-gray-900 group-hover:text-primary transition-colors">
                Fresh Meat Hub
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Premium Quality Meat</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Contact */}
            <a
              href="tel:+917986955634"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
              data-testid="header-phone"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">+91 79869 55634</span>
            </a>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  data-testid="header-cart-btn"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0">
                <CartSheet />
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
