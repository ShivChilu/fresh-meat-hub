import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Default placeholder image for categories without cover image
const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=800&fit=crop';

const FALLBACK_CATEGORY_IMAGES = {
  chicken: 'https://images.unsplash.com/photo-1584932894085-f095355f4c40?w=600&h=800&fit=crop',
  mutton: 'https://images.pexels.com/photos/13640373/pexels-photo-13640373.jpeg?w=600&h=800&fit=crop',
  others: 'https://images.unsplash.com/photo-1587279733259-26c7d2c0dba5?w=600&h=800&fit=crop',
};

const FALLBACK_DESCRIPTIONS = {
  chicken: 'Fresh farm chicken, tender & juicy',
  mutton: 'Premium quality goat meat',
  others: 'Fish, Prawns, Eggs & more',
};

export const CategoryCard = ({ category, productCount = 0 }) => {
  // Handle both string (old) and object (new) category format
  const categoryName = typeof category === 'string' ? category : category.name;
  const categoryDescription = typeof category === 'string' 
    ? FALLBACK_DESCRIPTIONS[categoryName.toLowerCase()] || 'Explore our selection'
    : category.description || FALLBACK_DESCRIPTIONS[categoryName.toLowerCase()] || 'Explore our selection';
  
  // Use cover image from category object, fallback to predefined images, then default
  const image = typeof category === 'string'
    ? FALLBACK_CATEGORY_IMAGES[categoryName.toLowerCase()] || DEFAULT_CATEGORY_IMAGE
    : category.coverImage || FALLBACK_CATEGORY_IMAGES[categoryName.toLowerCase()] || DEFAULT_CATEGORY_IMAGE;

  return (
    <Link
      to={`/category/${categoryName}`}
      className="category-card block aspect-[3/4] md:aspect-[4/5]"
      data-testid={`category-card-${categoryName}`}
    >
      <img
        src={image}
        alt={category}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 category-gradient z-10" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-white capitalize mb-1">
              {category}
            </h3>
            <p className="text-white/80 text-sm mb-2">{description}</p>
            {productCount > 0 && (
              <p className="text-white/60 text-xs">{productCount} products</p>
            )}
          </div>
          
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
