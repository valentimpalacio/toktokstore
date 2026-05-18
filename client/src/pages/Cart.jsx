import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/api';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [placing, setPlacing] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      addToast(t('cart.login_to_order'), 'info');
      return;
    }
    setPlacing(true);
    try {
      await api.post('/orders', {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total,
      });
      clearCart();
      addToast(t('cart.order_success'), 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || t('cart.order_failed'), 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container min-h-[60vh] flex-center flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="mx-auto text-text-muted mb-6" />
          <h1 className="text-4xl font-bold mb-4">{t('cart.empty_title')}</h1>
          <p className="text-text-muted mb-8 max-w-md">{t('cart.empty_desc')}</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            {t('cart.browse')} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">{t('cart.title')} <span className="premium-gradient">{t('cart.title_gradient')}</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass rounded-2xl p-6 flex gap-6 items-center"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-surface/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </Link>
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="font-bold hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                  <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg glass flex-center hover:bg-surface transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg glass flex-center hover:bg-surface transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="w-24 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => {
                    removeItem(item.id);
                    addToast(`${item.name} ${t('cart.removed')}`, 'info');
                  }}
                  className="text-text-muted hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-6">{t('cart.summary')}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-text-muted">
                <span>{t('cart.subtotal')} ({count} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('cart.shipping')}</span>
                <span className="text-emerald-400">{t('cart.free')}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={placing}
              className="w-full btn-primary py-4 disabled:opacity-50"
            >
              {placing ? t('cart.placing') : t('cart.place_order')}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-text-muted hover:text-red-400 text-sm mt-3 transition-colors"
            >
              {t('cart.clear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
