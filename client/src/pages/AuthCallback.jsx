import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    const handleAuth = async () => {
      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          localStorage.setItem('token', token);
          setUser(user);
          addToast('Welcome to Toktok Store!', 'success');
          // Brief delay for visual satisfaction
          setTimeout(() => navigate('/'), 1500);
        } catch {
          addToast('Authentication failed. Please try again.', 'error');
          navigate('/login');
        }
      } else {
        const error = searchParams.get('error');
        addToast(error ? `Auth error: ${error}` : 'Authentication failed', 'error');
        navigate('/login');
      }
    };

    handleAuth();
  }, [searchParams, navigate, setUser, addToast]);

  return (
    <div className="container min-h-[70vh] flex-center flex-col gap-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl glass flex-center shadow-2xl">
          <Loader2 className="text-primary animate-spin" size={40} />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-[40px] -z-10"
        ></motion.div>
      </motion.div>

      <div className="text-center space-y-4">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest text-sm uppercase"
        >
          <Sparkles size={16} />
          <span>Securing Session</span>
        </motion.div>
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold"
        >
          Finalizing <span className="premium-gradient">Access</span>
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-muted"
        >
          Please wait while we sync your digital profile...
        </motion.p>
      </div>
    </div>
  );
};

export default AuthCallback;
