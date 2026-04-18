import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/api';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-20">
      <Hero />

      <section className="container mt-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight font-display">
              {t('home.featured')} <span className="premium-gradient">{t('home.innovations')}</span>
            </h2>
            <p className="text-text-muted max-w-lg">{t('home.description')}</p>
          </div>
          <Link to="/shop" className="btn-outline">
            {t('nav.shop')}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Promo Section */}
      <section className="container mt-40">
        <div className="glass rounded-[40px] p-12 lg:p-20 relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                {t('home.join')} <span className="premium-gradient">{t('home.nebula')}</span>{' '}
                {t('home.ecosystem')}
              </h2>
              <p className="text-lg text-text-muted mb-10">{t('home.newsletter')}</p>
              <form
                className="flex flex-col sm:flex-row gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={t('home.email')}
                  className="glass flex-grow px-6 py-4 rounded-2xl border-white/10 text-white outline-none focus:border-primary/50 transition-all"
                />
                <button type="submit" className="btn-primary whitespace-nowrap px-10">
                  {t('home.subscribe')}
                </button>
              </form>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
                alt="Tech Setup"
                className="rounded-3xl shadow-2xl rotate-3"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
