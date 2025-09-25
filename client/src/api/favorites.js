const API_BASE = '/api';

export const fetchFavorites = async () => {
  try {
    const response = await fetch(`${API_BASE}/favorites`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const { mockBooks } = await import('../data/mockBooks');
    
    return favorites.map(fav => ({
      ...fav,
      book: mockBooks.find(book => book.id === fav.book_id) || {
        id: fav.book_id,
        title: 'Unknown Book',
        author: 'Unknown Author'
      }
    }));
  }
};

export const addToFavorites = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId })
    });
    if (!response.ok) throw new Error('Failed to add to favorites');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    
    if (favorites.find(fav => fav.book_id === bookId)) {
      throw new Error('Book already in favorites');
    }
    
    const newFavorite = {
      id: Date.now(),
      book_id: bookId,
      added_at: new Date().toISOString()
    };
    
    favorites.push(newFavorite);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    return newFavorite;
  }
};

export const removeFromFavorites = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE}/favorites/${bookId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove from favorites');
    return true;
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const updatedFavorites = favorites.filter(fav => fav.book_id !== bookId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    return true;
  }
};

export const isFavorite = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE}/favorites/${bookId}`);
    return response.ok;
  } catch (error) {
    // Fallback to localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    return favorites.some(fav => fav.book_id === bookId);
  }
};