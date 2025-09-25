const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com' 
    : 'http://localhost:5001');

export { API_BASE_URL };