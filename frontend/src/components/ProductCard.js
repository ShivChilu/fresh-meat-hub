import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1615937662601-4724eceda00f?w=400&h=300&fit=crop';

export const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product);
    }
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="product-card group" data-testid={`product-card-${product.id}`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        
        {/* Stock Badge */}
        <div className={`absolute top-3 left-3 stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? (
            <>
              <Check className="w-3 h-3" />
              In Stock
            </>
          ) : (
            'Out of Stock'
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-heading font-semibold text-gray-900 text-lg leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.weight || '500g'}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary text-xl">₹{product.price}</p>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Add to Cart / Quantity Controls */}
        {product.inStock ? (
          inCart ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-full p-1">
              <button
                onClick={handleDecrement}
                className="quantity-btn"
                data-testid={`decrement-${product.id}`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="quantity-btn"
                data-testid={`increment-${product.id}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold btn-active"
              data-testid={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )
        ) : (
          <Button
            disabled
            className="w-full rounded-full bg-gray-200 text-gray-500 cursor-not-allowed"
            data-testid={`out-of-stock-${product.id}`}
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
