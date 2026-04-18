import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Mesh Gradient Elements */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/15 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[0%] left-[20%] w-[60%] h-[30%] rounded-full bg-accent/10 blur-[150px]"
      />
      
      {/* Noise Overlay for Texture - CSS-based subtle grain */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,.5) 2px, rgba(255,255,255,.5) 4px),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.5) 2px, rgba(255,255,255,.5) 4px)
          `,
        }}
      ></div>
    </div>
  );
};

export default Background;
