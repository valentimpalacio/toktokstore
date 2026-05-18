import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading)
    return (
      <div className="container py-20">
        <div className="skeleton h-96 rounded-3xl"></div>
      </div>
    );
  if (!product) return null;

  return (
    <div className="container py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> {t('product_detail.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="glass rounded-3xl overflow-hidden p-8 aspect-square flex-center">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface/50 to-surface/20">
                <Package size={96} className="text-text-muted/40" />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain rounded-2xl"
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-sm text-secondary font-bold uppercase tracking-widest mb-2">
              {product.category?.name || t('product.technology')}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-text-muted text-sm">(4.9) · {product.stock} {t('product_detail.in_stock')}</span>
            </div>
          </div>

          <p className="text-2xl font-bold font-mono">${product.price.toFixed(2)}</p>

          <p className="text-text-muted leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck size={24} className="text-primary" />
              <span className="text-xs text-text-muted">{t('product_detail.free_shipping')}</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield size={24} className="text-primary" />
              <span className="text-xs text-text-muted">{t('product_detail.warranty')}</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RotateCcw size={24} className="text-primary" />
              <span className="text-xs text-text-muted">{t('product_detail.return_policy')}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                addItem(product);
                addToast(`${product.name} ${t('product_detail.added_to_cart')}`, 'success');
              }}
              className="btn-primary flex-1 py-4 flex-center gap-2"
            >
              <ShoppingCart size={20} /> {t('product_detail.add_to_cart')}
            </button>
          </div>
        </motion.div>
      </div>

      <RelatedProducts currentId={id} categoryId={product.categoryId} />
    </div>
  );
};

function RelatedProducts({ currentId, categoryId }) {
  const [products, setProducts] = React.useState([]);
  const { t } = useLanguage();

  React.useEffect(() => {
    api
      .get('/products', { params: { category: categoryId } })
      .then((res) => setProducts(res.data.data.filter((p) => p.id !== currentId).slice(0, 4)));
  }, [categoryId, currentId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-24">
      <h2 className="text-2xl font-bold mb-8">
        {t('product_detail.related_title')} <span className="premium-gradient">{t('product_detail.related_gradient')}</span>
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group">
            <div className="glass rounded-2xl overflow-hidden group-hover:border-primary/30 transition-all">
              <div className="aspect-square overflow-hidden p-4 bg-surface/50 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.parentElement;
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('class', 'text-text-muted/40');
                    svg.setAttribute('width', '48');
                    svg.setAttribute('height', '48');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.innerHTML =
                      '<path fill="none" stroke="currentColor" stroke-width="2" d="M20 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7m0 0V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m0 0h4a2 2 0 0 1 2 2v10"/>';
                    placeholder.appendChild(svg);
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ProductDetail;
