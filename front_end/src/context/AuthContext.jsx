import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage on app start
  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem('session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.token && session.currentUser) {
          setUser(session.currentUser);
          setToken(session.token);
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      localStorage.removeItem('session');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    
    // Save to localStorage
    const session = {
      currentUser: userData,
      token: authToken
    };
    localStorage.setItem('session', JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('session');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};