import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { Search, X, Filter, Zap } from 'lucide-react';
import api from '../api/api';
import { useLanguage } from '../context/LanguageContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get('/products/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (search) params.search = search;
    if (maxPrice < 2000) params.maxPrice = maxPrice;

    api
      .get('/products', { params })
      .then((res) => setProducts(res.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, maxPrice]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearch('');
    setMaxPrice(2000);
  };

  return (
    <div className="container py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-primary"></div>
          <span className="text-secondary font-bold tracking-widest text-xs uppercase">
            {t('shop.premium')}
          </span>
        </div>
        <h1 className="text-5xl font-bold mb-4 font-display">
          {t('shop.title')} <span className="premium-gradient">{t('shop.collection')}</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl">{t('shop.description')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 space-y-10 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder={t('shop.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass bg-white/5 border-white/10 pl-12 pr-10 py-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Filter size={18} className="text-primary" />
                <h3 className="text-lg font-bold font-display">{t('shop.categories')}</h3>
              </div>
              <ul className="space-y-4">
                <li
                  onClick={() => setSelectedCategory('')}
                  className={`group flex items-center justify-between cursor-pointer transition-all ${!selectedCategory ? 'text-primary font-bold' : 'text-text-muted'}`}
                >
                  <span className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${!selectedCategory ? 'bg-primary scale-125' : 'bg-transparent border border-gray-600'}`}
                    ></div>
                    {t('shop.all')}
                  </span>
                  {!selectedCategory && <Zap size={14} />}
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group flex items-center justify-between cursor-pointer transition-all ${selectedCategory === cat.id ? 'text-primary font-bold' : 'text-text-muted'}`}
                  >
                    <span className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full transition-all ${selectedCategory === cat.id ? 'bg-primary scale-125' : 'bg-transparent border border-gray-600 group-hover:border-primary'}`}
                      ></div>
                      {cat.name}
                    </span>
                    {selectedCategory === cat.id && <Zap size={14} />}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-display">{t('shop.price')}</h3>
                <span className="font-mono text-primary font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                className="w-full accent-primary h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-3 font-bold uppercase tracking-widest">
                <span>Min: $0</span>
                <span>Max: $2000</span>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-3 rounded-xl border border-white/10 text-sm text-text-muted hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <X size={14} /> {t('shop.clear')}
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                alt="Empty state"
                className="w-48 h-48 mb-8 opacity-50 grayscale"
              />
              <h3 className="text-3xl font-bold mb-4 font-display">{t('shop.no_results')}</h3>
              <p className="text-text-muted max-w-md mb-8">{t('shop.no_results_desc')}</p>
              <div className="flex gap-4">
                <button onClick={clearFilters} className="btn-primary">
                  {t('shop.clear')}
                </button>
                <button
                  onClick={() => setSelectedCategory(categories[0]?.id)}
                  className="btn-outline"
                >
                  {t('shop.view_cats')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
