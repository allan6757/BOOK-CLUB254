import { API_BASE_URL } from '../config/api';
const API_BASE = `${API_BASE_URL}/api`;

export const sendRecommendation = async (friendId, bookId, message = '') => {
  try {
    const response = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friend_id: friendId, book_id: bookId, message })
    });
    if (!response.ok) throw new Error('Failed to send recommendation');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    
    const newRecommendation = {
      id: Date.now(),
      from_user_id: userId,
      to_user_id: friendId,
      book_id: bookId,
      message,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    recommendations.push(newRecommendation);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
    return newRecommendation;
  }
};

export const fetchRecommendations = async () => {
  try {
    const response = await fetch(`${API_BASE}/recommendations`);
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    const { mockBooks } = await import('../data/mockBooks');
    
    // Get recommendations for current user
    const userRecommendations = recommendations
      .filter(rec => rec.to_user_id === userId)
      .map(rec => ({
        ...rec,
        book: mockBooks.find(book => book.id === rec.book_id) || {
          id: rec.book_id,
          title: 'Unknown Book',
          author: 'Unknown Author'
        },
        from_user: { username: `User${rec.from_user_id}` }
      }));
    
    return userRecommendations;
  }
};

export const updateRecommendationStatus = async (recommendationId, status) => {
  try {
    const response = await fetch(`${API_BASE}/recommendations/${recommendationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update recommendation');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    const updatedRecommendations = recommendations.map(rec =>
      rec.id === recommendationId ? { ...rec, status } : rec
    );
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
    return updatedRecommendations.find(rec => rec.id === recommendationId);
  }
};