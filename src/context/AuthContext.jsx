import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set base URL for authentication APIs
const API_URL = 'http://localhost:5000/api/auth';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('taskman_token');
      if (token) {
        try {
          // Set default auth header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get(`${API_URL}/profile`);
          setUser(res.data);
        } catch (error) {
          console.error('Session expired or invalid token', error);
          localStorage.removeItem('taskman_token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const { token, ...userData } = res.data;
    
    localStorage.setItem('taskman_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    const { token, ...userData } = res.data;
    
    localStorage.setItem('taskman_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskman_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
