import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const CATEGORY_INFO = {
  chicken: {
    title: 'Chicken',
    description: 'Fresh farm chicken - tender, juicy, and perfect for any dish',
    image: 'https://images.unsplash.com/photo-1584932894085-f095355f4c40?w=1200&h=400&fit=crop',
  },
  mutton: {
    title: 'Mutton',
    description: 'Premium quality goat meat - rich flavor and perfect texture',
    image: 'https://images.pexels.com/photos/13640373/pexels-photo-13640373.jpeg?w=1200&h=400&fit=crop',
  },
  others: {
    title: 'Others',
    description: 'Fish, Prawns, Eggs & ready-to-cook items',
    image: 'https://images.unsplash.com/photo-1587279733259-26c7d2c0dba5?w=1200&h=400&fit=crop',
  },
};

const CategoryPage = () => {
  const { category } = useParams();
  const { products, loading, error } = useProducts(category);
  const [sortBy, setSortBy] = useState('default');
  const [showInStock, setShowInStock] = useState(false);

  const categoryInfo = CATEGORY_INFO[category] || {
    title: category,
    description: 'Browse our selection',
    image: CATEGORY_INFO.others.image,
  };

  // Filter and sort products
  let filteredProducts = [...products];
  
  if (showInStock) {
    filteredProducts = filteredProducts.filter(p => p.inStock);
  }

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="mobile-nav-padding" data-testid="category-page">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden" data-testid="category-hero">
        <img
          src={categoryInfo.image}
          alt={categoryInfo.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-2 capitalize">
              {categoryInfo.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm" data-testid="breadcrumb">
          <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium capitalize">{category}</span>
        </nav>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="flex items-center gap-3" data-testid="filters">
            {/* In Stock Toggle */}
            <Button
              variant={showInStock ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm ${showInStock ? 'bg-primary' : ''}`}
              onClick={() => setShowInStock(!showInStock)}
              data-testid="in-stock-filter"
            >
              <Filter className="w-4 h-4 mr-1" />
              In Stock Only
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="sort-select"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="loading-skeleton">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-1/2" />
                  <div className="h-10 skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16" data-testid="error-state">
            <p className="text-red-500 mb-4">Failed to load products</p>
            <Button onClick={() => window.location.reload()} className="rounded-full">
              Try Again
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-state">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {showInStock ? 'No products in stock in this category.' : 'This category is empty.'}
            </p>
            <Link to="/">
              <Button className="rounded-full bg-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
