/**
 * Deals with user authentication and user data
 */

'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../../firebase_config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Function to store user data in localStorage
  const storeUserDataLocally = (authUser) => {
    try {
      // Use localStorage for web instead of AsyncStorage
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (error) {
      console.error('Error storing user data locally:', error);
    }
  };

  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();

    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        storeUserDataLocally(authUser);
      }
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
