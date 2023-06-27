import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'; // add this line

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('user');
  const [currentUser, setCurrentUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'));
  
  const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post("http://localhost:3000/users/login", { email, password });
            console.log('auth.js, 18')
            // Set auth token in local storage and context
            const { token, user } = response.data; // Assuming user data is also returned
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("user", JSON.stringify(user)); // store user data
            setAuthToken(token);
            setCurrentUser(user); // set user data in context
            resolve();

        } catch (error) {
            reject(error);
        }
    });
  };




  const value = {
    currentUser,
    setCurrentUser,
    login,
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
