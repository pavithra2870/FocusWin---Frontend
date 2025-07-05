import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Keep this, it's correct!

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        console.log('Checking user status...');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include', // This is correct
        });

        console.log('Auth check response status:', response.status);
        if (response.ok) {
          // This part is correct: user is logged in
          const userData = await response.json();
          console.log('User data received:', userData);
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          // --- CHANGE #1: Handle failed authentication ---
          // This block is crucial. If the user is not logged in,
          // we must ensure the state reflects that.
          console.log('Authentication failed');
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        // --- CHANGE #2: Handle network errors ---
        // If the backend is down, we should assume the user is logged out.
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        // --- CHANGE #3: Always stop loading ---
        // This MUST be called at the end, whether the check
        // succeeded or failed. Otherwise, your app will show "Loading..." forever.
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []); // The empty array is correct, it makes this run only once.

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    // This is correct
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setIsLoggedIn(false);
    setUser(null);
    // Optionally, you can force a redirect here if needed
    // window.location.href = '/login';
  };

  // --- CHANGE #4: Improved loading display ---
  // The value is provided to the context
  const value = { isLoggedIn, user, loading, login, logout };

  // By wrapping children with !loading, we prevent components from rendering
  // with incorrect auth data before the check is complete.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
