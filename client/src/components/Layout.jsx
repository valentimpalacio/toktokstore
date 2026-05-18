import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Layout = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <footer className="glass border-t mt-20 py-12">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">TOKTOK<span className="premium-gradient">STORE</span></h3>
            <p className="text-text-muted max-w-sm">
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer.quick_links')}</h4>
            <ul className="flex flex-col gap-2 text-text-muted">
              <li><Link to="/" className="hover:text-primary">{t('nav.home')}</Link></li>
              <li><Link to="/shop" className="hover:text-primary">{t('nav.shop')}</Link></li>
              <li><Link to="/cart" className="hover:text-primary">{t('nav.cart')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer.follow_us')}</h4>
            <div className="flex gap-4 text-text-muted">
              <a href="#" className="hover:text-primary">Twitter</a>
              <a href="#" className="hover:text-primary">Instagram</a>
              <a href="#" className="hover:text-primary">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="container border-t border-glass-border mt-12 pt-8 text-center text-text-muted text-sm">
          {t('footer.copyright').replace('{year}', new Date().getFullYear())}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
