import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'; // add this line

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('user');
  const [currentUser, setCurrentUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  console.log("This is the current user in auth.js::: ", JSON.stringify(currentUser));
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'));


  const value = {
    currentUser,
    setCurrentUser,
    authToken,
    setAuthToken,
    // other functions as needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
