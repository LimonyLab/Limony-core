import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('user');
  const [currentUser, setCurrentUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  console.log("This is the current user in auth.js::: ", JSON.stringify(currentUser));

  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'));
  const [tokenExpiresIn, setTokenExpiresIn] = useState(localStorage.getItem('tokenExpiresIn')); 

  const isTokenValid = () => {
    if (!authToken || !tokenExpiresIn) return false;
    const currentTime = Date.now(); // current time in milliseconds
    // convert expiresIn to milliseconds
    const expiryTimeInMilliseconds = tokenExpiresIn * 1000; 
    return currentTime < expiryTimeInMilliseconds;
  }

  const value = {
    currentUser,
    setCurrentUser,
    authToken,
    setAuthToken,
    tokenExpiresIn,
    setTokenExpiresIn,
    isTokenValid,
    // other functions as needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
