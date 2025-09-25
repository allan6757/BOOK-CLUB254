const API_BASE = '/api';

export const fetchReviews = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE}/books/${bookId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  } catch (error) {
    // Fallback to localStorage - reviews are global, not user-specific
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(review => review.book_id === parseInt(bookId));
  }
};

export const createReview = async (bookId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/books/${bookId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const newReview = {
      id: Date.now(),
      book_id: parseInt(bookId),
      user_id: userId,
      ...reviewData,
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newReview;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!response.ok) throw new Error('Failed to update review');
  return response.json();
};

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete review');
  return response.ok;
};