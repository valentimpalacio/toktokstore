import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Zap, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Rocket, title: t('about.val1_title'), desc: t('about.val1_desc') },
    { icon: Shield, title: t('about.val2_title'), desc: t('about.val2_desc') },
    { icon: Zap, title: t('about.val3_title'), desc: t('about.val3_desc') },
    { icon: Heart, title: t('about.val4_title'), desc: t('about.val4_desc') },
  ];

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container text-center"
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('about.title')} <span className="premium-gradient">ToktokStore</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container my-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
              alt="Our Mission"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">{t('about.mission_title')}</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              {t('about.mission_p1')}
            </p>
            <p className="text-text-muted leading-relaxed">
              {t('about.mission_p2')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container my-20">
        <h2 className="text-4xl font-bold text-center mb-12">{t('about.why_title')} <span className="premium-gradient">Us</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8 text-center hover:border-primary/30 transition-all"
            >
              <val.icon size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{val.title}</h3>
              <p className="text-text-muted text-sm">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container my-20">
        <div className="glass rounded-[40px] p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('about.cta_title')}</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">{t('about.cta_desc')}</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
            {t('about.cta_btn')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
