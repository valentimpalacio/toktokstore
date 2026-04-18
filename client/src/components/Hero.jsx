import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            <span className="tracking-widest uppercase">{t('hero.future')}</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight text-glow"
          >
            {t('hero.elevate')} <span className="premium-gradient">{t('hero.digital') || 'Digital'}</span> {t('hero.universe')}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl lg:text-2xl text-text-muted mb-12 max-w-xl leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
            <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-10">
              {t('hero.explore')} <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn-outline text-lg px-10">
              {t('hero.learn')}
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-16 flex items-center gap-12">
            <div className="hover-lift">
              <p className="text-3xl font-bold premium-gradient">15k+</p>
              <p className="text-text-muted text-sm uppercase tracking-wider">{t('hero.sold')}</p>
            </div>
            <div className="w-px h-12 bg-border/50"></div>
            <div className="hover-lift">
              <p className="text-3xl font-bold premium-gradient">4.9/5</p>
              <p className="text-text-muted text-sm uppercase tracking-wider">{t('hero.rating')}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="relative z-10 rounded-[48px] overflow-hidden glass p-5 aspect-square shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000" 
              alt="Premium Tech" 
              className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Floating Card */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 z-20 glass p-8 rounded-3xl border-white/10 hidden md:flex items-center gap-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex-center shadow-lg shadow-accent/20">
              <Sparkles className="text-white" size={32} />
            </div>
            <div>
              <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">{t('hero.new_tech')}</p>
              <p className="font-bold text-lg">{t('hero.quantum')}</p>
              <p className="text-text-muted text-sm">{t('hero.preorder')}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

