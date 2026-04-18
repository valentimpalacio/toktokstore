import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-[85vh] flex-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-12 rounded-[48px] shadow-2xl"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex-center mx-auto mb-6">
            <LogIn className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-3">Welcome <span className="premium-gradient">Back</span></h1>
          <p className="text-text-muted">Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Google Button */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="http://localhost:5000/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-semibold"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.a>

          <div className="relative flex items-center gap-4">
            <div className="flex-grow h-px bg-white/5"></div>
            <span className="text-xs text-text-muted uppercase tracking-widest">or email</span>
            <div className="flex-grow h-px bg-white/5"></div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 tracking-wide">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={22} />
              <input 
                {...register('email')}
                type="email" 
                className={`w-full glass bg-white/5 border-white/10 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-primary/50 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 tracking-wide">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={22} />
              <input 
                {...register('password')}
                type="password" 
                className={`w-full glass bg-white/5 border-white/10 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-primary/50 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            className="w-full btn-primary py-4 mt-4 flex-center gap-3 group disabled:opacity-50 shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Login Now <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-text-muted mb-4">New to the ecosystem?</p>
          <Link to="/register" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all underline-offset-4 hover:underline">
            Join Now <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
