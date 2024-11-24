/**
 * Login page component
 */

'use client';
import React, { useState, useEffect } from 'react';
import { firebaseDB } from '../../../firebase_config';
import { getDatabase, ref, onValue, update, set, get } from 'firebase/database';
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';

import { useRouter } from 'next/navigation';

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();

  const auth = getAuth();
  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/main-menu'); // Redirect to dashboard if already signed in
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [router]);

  const addUserData = async (user) => {
    const database = getDatabase(firebaseDB);

    if (!user || !user.displayName) {
      console.error('Invalid user data.');
      return;
    }

    const userRef = ref(database, `Users/${user.displayName}`);

    try {
      // Check if the user already exists
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log('User already exists in the database.');
        return;
      }

      const newUserData = {
        displayName: user.displayName
      };
      // Create a reference to the user count
      const userCountRef = ref(database, 'Users/UserCount');

      // Retrieve current user count and increment it
      const userCountSnapshot = await get(userCountRef);
      let newUserCount = 1; // Default if the count doesn't exist

      if (userCountSnapshot.exists()) {
        newUserCount = userCountSnapshot.val() + 1; // Increment the current count
      }

      await set(userRef, newUserData);
      await set(userCountRef, newUserCount);
      console.log('User added successfully.');
    } catch (error) {
      console.error('Error checking or adding user:', error);
    }
  };
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      addUserData(user);
      router.push('/main-menu'); // Redirect to a protected page
    } catch (err) {
      setError('Error signing in with Google: ' + err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push('/main-menu'); // Redirect after signing in as guest
    } catch (error) {
      console.error('Error during guest login:', error.message);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      data-testid="Login screen"
    >
      <strong>Sign In</strong>
      {error && alert(error)}
      <br />
      <button
        className="bg-white p-2 m-8 rounded-lg hover:bg-green-600"
        onClick={handleGoogleSignIn}
      >
        Sign In with Google
      </button>
      <button
        className="bg-white p-2 m-8 rounded-lg hover:bg-green-600"
        onClick={handleGuestLogin}
      >
        Continue as Guest
      </button>
    </div>
  );
}
