import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, Calendar } from 'lucide-react';
import APIServices from '../services/api.service';
import { formatDate, formatRating } from '../utils/formatters';
import { useAuth } from '../hooks/useCustom';

export const ReviewsSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await APIServices.ratings.getByProduct(productId);
      setReviews(response.data);
      setAverageRating(response.summary.averageRating);
      setTotalReviews(response.summary.totalRatings);
      
      // Check if user already has a review
      if (user) {
        const existingReview = response.data.find(r => r.userId === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setRating(existingReview.rating);
          setComment(existingReview.comment || '');
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('Por favor, adicione um comentário');
      return;
    }

    try {
      setSubmitting(true);
      await APIServices.ratings.create({
        productId,
        rating,
        comment: comment.trim()
      });

      // Reload reviews
      loadReviews();
      setComment('');
      setRating(5);
    } catch (error) {
      alert(error.message || 'Erro ao salvar review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm('Tem certeza que deseja deletar sua review?')) {
      try {
        await APIServices.ratings.delete(reviewId);
        loadReviews();
      } catch (error) {
        alert(error.message || 'Erro ao deletar review');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatRating(averageRating)}
            </div>
            <div className="flex gap-1 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{totalReviews} avaliação{totalReviews !== 1 ? 's' : ''}</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter(r => r.rating === stars).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{stars} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {userReview ? 'Sua Avaliação' : 'Compartilhe sua avaliação'}
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentário
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência com este produto..."
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando...' : userReview ? 'Atualizar Avaliação' : 'Publicar Avaliação'}
            </button>

            {userReview && (
              <button
                type="button"
                onClick={() => handleDeleteReview(userReview.id)}
                className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition"
              >
                Deletar Avaliação
              </button>
            )}
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Avaliações ({reviews.length})
        </h3>

        <AnimatePresence>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  {user && review.userId === user.id && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Deletar
                    </button>
                  )}
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700">{review.comment}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewsSection;
