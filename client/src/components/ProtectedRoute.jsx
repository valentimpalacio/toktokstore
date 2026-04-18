import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useCustom';
import { motion } from 'framer-motion';

/**
 * Protected route component - redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Admin only route
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="ADMIN">{children}</ProtectedRoute>;
};

export default ProtectedRoute;
