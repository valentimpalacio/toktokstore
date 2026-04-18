/**
 * Format price as currency (BRL)
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Format date in Brazilian format
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Format date only (no time)
 */
export const formatDateOnly = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

/**
 * Format rating to stars
 */
export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return rating.toFixed(1);
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'SHIPPED': 'bg-purple-100 text-purple-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status label in Portuguese
 */
export const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Pendente',
    'PROCESSING': 'Processando',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregue',
    'CANCELLED': 'Cancelado'
  };
  return labels[status] || status;
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (original, discounted) => {
  if (!original || !discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

/**
 * Format product slug from name
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
