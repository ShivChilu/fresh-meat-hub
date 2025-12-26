import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import CartSheet from './CartSheet';

export const MobileNav = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: Grid3X3 },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, isCart: true },
    { name: 'Admin', path: '/admin', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/categories') return location.pathname.startsWith('/category');
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-nav md:hidden" data-testid="mobile-bottom-nav">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isCart) {
              return (
                <Sheet key={item.name}>
                  <SheetTrigger asChild>
                    <button
                      className="flex flex-col items-center gap-1 py-2 px-3 relative"
                      data-testid="mobile-nav-cart"
                    >
                      <div className="relative">
                        <Icon className={`w-5 h-5 ${cartCount > 0 ? 'text-primary' : 'text-gray-500'}`} />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${cartCount > 0 ? 'text-primary' : 'text-gray-500'}`}>
                        {item.name}
                      </span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
                    <CartSheet />
                  </SheetContent>
                </Sheet>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center gap-1 py-2 px-3"
                data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              >
                <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
