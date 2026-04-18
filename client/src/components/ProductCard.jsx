import React, { useState } from 'react';
import { ShoppingCart, Star, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <motion.div 
        className="glass rounded-3xl overflow-hidden border border-white/5 hover-lift h-full flex flex-col"
      >
        <div className="relative aspect-square overflow-hidden bg-surface/30 flex items-center justify-center">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface/50 to-surface/20">
              <Package size={48} className="text-text-muted/40" />
            </div>
          ) : (
            <img 
              src={product.image} 
              alt={product.name} 
              onError={() => setImageError(true)}
              className={`w-full h-full object-contain p-8 transition-all duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
            />
          )}
          
          {/* Action Overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex-center">
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <div className="badge badge-glass flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="font-mono">4.9</span>
            </div>
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isOutOfStock ? (
              <span className="badge badge-accent">Indisponível</span>
            ) : product.stock <= 5 ? (
              <span className="badge badge-primary animate-pulse">Últimas Unidades</span>
            ) : (
              product.isNew && <span className="badge badge-secondary">Novo</span>
            )}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em]">{product.category?.name || 'TECHNOLOGY'}</p>
            <p className="text-xl font-bold font-display text-glow">${product.price}</p>
          </div>
          <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-text-muted text-sm mb-6 line-clamp-2 h-10 leading-relaxed">{product.description}</p>
          
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full btn-primary ${isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]'} transition-all`}
            >
              {isOutOfStock ? 'Esgotado' : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;

