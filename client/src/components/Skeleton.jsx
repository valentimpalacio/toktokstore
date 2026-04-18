import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClass = "skeleton";
  const variantClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "h-4 w-full rounded-md",
    badge: "h-6 w-20 rounded-full"
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant] || ''} ${className}`} />
  );
};

export const ProductSkeleton = () => (
  <div className="glass rounded-3xl overflow-hidden hover-lift h-full border border-white/5">
    <div className="aspect-square skeleton rounded-none" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton variant="badge" />
        <Skeleton variant="text" className="w-16 h-6" />
      </div>
      <Skeleton variant="text" className="h-7 w-3/4" />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <Skeleton variant="rect" className="h-12 w-full mt-4" />
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="container py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
    <Skeleton variant="rect" className="aspect-square rounded-3xl" />
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton variant="badge" className="w-32" />
        <Skeleton variant="text" className="h-12 w-3/4" />
        <Skeleton variant="text" className="h-8 w-1/4" />
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="rect" className="h-14 w-1/2" />
        <Skeleton variant="rect" className="h-14 w-1/4" />
      </div>
    </div>
  </div>
);

export default Skeleton;
