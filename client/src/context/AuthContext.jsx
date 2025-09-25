import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      const savedPreferences = localStorage.getItem(`userPreferences_${userData.id}`);
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return { user: data };
  };

  const logout = () => {
    setUser(null);
    setUserPreferences(null);
    localStorage.removeItem('user');
    if (user?.id) {
      localStorage.removeItem(`userPreferences_${user.id}`);
    }
  };

  const savePreferences = (preferences) => {
    setUserPreferences(preferences);
    const userId = user?.id || 'guest';
    localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(preferences));
  };

  const value = {
    user,
    userPreferences,
    login,
    signup,
    logout,
    savePreferences,
    isAuthenticated: !!user,
    hasPreferences: !!userPreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};