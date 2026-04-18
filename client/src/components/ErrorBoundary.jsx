import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="container min-h-screen flex-center flex-col text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[48px] max-w-2xl border-red-500/20 shadow-2xl"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex-center mx-auto mb-8 shadow-inner shadow-red-500/5">
          <AlertTriangle className="text-red-500" size={40} />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Something went <span className="text-red-500">wrong</span></h1>
        <p className="text-text-muted text-lg mb-8 leading-relaxed">
          We encountered an unexpected error. Don't worry, your data is safe. 
          You can try refreshing the component or going back home.
        </p>

        <div className="bg-black/20 p-4 rounded-2xl mb-10 overflow-auto max-h-40">
          <code className="text-red-400 text-sm font-mono block text-left">
            {error.message}
          </code>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={resetErrorBoundary}
            className="btn-primary flex items-center gap-2 group"
          >
            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          <a 
            href="/"
            className="btn-outline flex items-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export const GlobalErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Clear caches or states if needed
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
