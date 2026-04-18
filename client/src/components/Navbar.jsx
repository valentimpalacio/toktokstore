import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Cpu, Package, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
            <Cpu size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            TOKTOK<span className="premium-gradient">STORE</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-primary font-medium transition-colors">{t('nav.home')}</Link>
          <Link to="/shop" className="hover:text-primary font-medium transition-colors">{t('nav.shop')}</Link>
          <Link to="/about" className="hover:text-primary font-medium transition-colors">{t('nav.about')}</Link>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-surface/50 p-1.5 rounded-xl border border-white/5">
            <Globe size={16} className="text-text-muted ml-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-bold outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-surface">EN</option>
              <option value="pt" className="bg-surface">PT</option>
              <option value="es" className="bg-surface">ES</option>
            </select>
          </div>

          <Link to="/cart" className="relative p-2 hover:bg-surface rounded-full transition-colors">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-5 h-5 flex-center rounded-full font-bold">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted hidden lg:inline">Hi, {user.name || user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="p-2 hover:bg-accent/10 hover:text-accent rounded-full transition-colors" aria-label="Logout">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-6">{t('nav.login')}</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)}>{t('nav.shop')}</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
            {t('nav.cart')} {count > 0 && <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">{count}</span>}
          </Link>
          
          <div className="flex items-center gap-3 py-2 border-t border-white/5 pt-6">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-primary" />
              <button onClick={() => setLanguage('en')} className={`text-sm font-bold ${language === 'en' ? 'text-primary' : 'text-text-muted'}`}>EN</button>
              <span className="text-white/10">|</span>
              <button onClick={() => setLanguage('pt')} className={`text-sm font-bold ${language === 'pt' ? 'text-primary' : 'text-text-muted'}`}>PT</button>
              <span className="text-white/10">|</span>
              <button onClick={() => setLanguage('es')} className={`text-sm font-bold ${language === 'es' ? 'text-primary' : 'text-text-muted'}`}>ES</button>
            </div>
          </div>

          {user ? (
            <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
              <span className="text-sm text-text-muted">Hi, {user.name || user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-left text-accent font-bold">{t('nav.logout') || 'Logout'}</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary flex-center" onClick={() => setIsMenuOpen(false)}>{t('nav.login')}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

