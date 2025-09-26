import { API_BASE_URL } from '../config/api';
const API_BASE = `${API_BASE_URL}/api`;

export const fetchReadingList = async () => {
  try {
    const response = await fetch(`${API_BASE}/reading-list`);
    if (!response.ok) throw new Error('Failed to fetch reading list');
    return response.json();
  } catch (error) {
    // Fallback to localStorage for demo
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const readingList = JSON.parse(localStorage.getItem(`readingList_${userId}`) || '[]');
    const { mockBooks } = await import('../data/mockBooks');
    
    // Add book details to reading list items
    return readingList.map(item => ({
      ...item,
      book: mockBooks.find(book => book.id === item.book_id) || {
        id: item.book_id,
        title: 'Unknown Book',
        author: 'Unknown Author',
        genre: 'Unknown'
      }
    }));
  }
};

export const addToReadingList = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE}/reading-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId })
    });
    if (!response.ok) throw new Error('Failed to add to reading list');
    return response.json();
  } catch (error) {
    // Fallback to localStorage for demo
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const readingList = JSON.parse(localStorage.getItem(`readingList_${userId}`) || '[]');
    const newItem = {
      id: Date.now(),
      book_id: bookId,
      status: 'want_to_read',
      added_at: new Date().toISOString()
    };
    
    // Check if book already exists
    if (readingList.find(item => item.book_id === bookId)) {
      throw new Error('Book already in reading list');
    }
    
    readingList.push(newItem);
    localStorage.setItem(`readingList_${userId}`, JSON.stringify(readingList));
    return newItem;
  }
};

export const removeFromReadingList = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE}/reading-list/${itemId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove from reading list');
    return response.ok;
  } catch (error) {
    // Fallback to localStorage for demo
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const readingList = JSON.parse(localStorage.getItem(`readingList_${userId}`) || '[]');
    const updatedList = readingList.filter(item => item.id !== itemId);
    localStorage.setItem(`readingList_${userId}`, JSON.stringify(updatedList));
    return true;
  }
};

export const updateReadingStatus = async (itemId, status) => {
  try {
    const response = await fetch(`${API_BASE}/reading-list/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update reading status');
    return response.json();
  } catch (error) {
    // Fallback to localStorage for demo
    const userId = JSON.parse(localStorage.getItem('user'))?.id || 'guest';
    const readingList = JSON.parse(localStorage.getItem(`readingList_${userId}`) || '[]');
    const updatedList = readingList.map(item => 
      item.id === itemId ? { ...item, status } : item
    );
    localStorage.setItem(`readingList_${userId}`, JSON.stringify(updatedList));
    return updatedList.find(item => item.id === itemId);
  }
};