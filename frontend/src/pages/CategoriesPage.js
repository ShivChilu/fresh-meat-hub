import CategoryCard from '../components/CategoryCard';
import { useProducts } from '../hooks/useProducts';

const CATEGORIES = ['chicken', 'mutton', 'others'];

const CategoriesPage = () => {
  const { products } = useProducts();

  return (
    <div className="mobile-nav-padding min-h-screen" data-testid="categories-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-2">
            All Categories
          </h1>
          <p className="text-gray-600">
            Browse our complete selection of fresh meat products
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              productCount={products.filter(p => p.category === category).length}
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐔</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Chicken</h3>
              <p className="text-gray-600 text-sm">
                Fresh farm chicken including whole chicken, breast, legs, wings, and boneless cuts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐐</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Mutton</h3>
              <p className="text-gray-600 text-sm">
                Premium goat meat including curry cut, biryani cut, keema, and special cuts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🦐</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Others</h3>
              <p className="text-gray-600 text-sm">
                Fresh fish, prawns, eggs, and ready-to-cook marinated items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
