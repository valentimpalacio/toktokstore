import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Zap, Heart } from 'lucide-react';

const About = () => {
  const values = [
    { icon: Rocket, title: 'Innovation First', desc: 'We curate the latest technology to keep you ahead of the curve.' },
    { icon: Shield, title: 'Quality Guaranteed', desc: 'Every product is tested and verified before reaching your hands.' },
    { icon: Zap, title: 'Fast Delivery', desc: 'Free shipping on all orders with tracked delivery.' },
    { icon: Heart, title: 'Customer Love', desc: '24/7 support team ready to help with anything you need.' },
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
            About <span className="premium-gradient">ToktokStore</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            We are a premium technology e-commerce platform dedicated to bringing you the most innovative
            and high-quality gadgets from around the world.
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
            <h2 className="text-4xl font-bold mb-6">Our <span className="premium-gradient">Mission</span></h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Founded in 2024, ToktokStore was born from a simple idea: make premium technology accessible to everyone.
              We believe that cutting-edge gadgets shouldn't be complicated or overpriced.
            </p>
            <p className="text-text-muted leading-relaxed">
              Our team of tech enthusiasts carefully selects each product, ensuring it meets our high standards
              for quality, design, and innovation. From smartphones to smartwatches, we've got your digital life covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container my-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose <span className="premium-gradient">Us</span></h2>
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
          <h2 className="text-3xl font-bold mb-4">Ready to <span className="premium-gradient">Explore</span>?</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">Check out our collection of premium gadgets and find your next favorite tech.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
            Visit Shop
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
