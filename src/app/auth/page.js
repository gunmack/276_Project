/**
 * Login page component
 */

'use client';
import React, { useState, useEffect } from 'react';
import { firebaseDB } from '../../firebase_config';
import { getDatabase, ref, set, get } from 'firebase/database';
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';

import { useRouter } from 'next/navigation';
import Toolbar from '../../components/Toolbar';

export default function Login() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const [popup, setPopup] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user.displayName) {
          router.push('/main-menu'); // Redirect to dashboard if already signed in
        }
      } catch (error) {
        setMsg('No user is currently signed in.');
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
        // console.log('User already exists in the database.');
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
      // console.log('User added successfully.');
    } catch (error) {
      console.error('Error checking or adding user:', error);
    }
  };
  const handleGoogleSignIn = async () => {
    setPopup(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      addUserData(user);
      router.push('/main-menu'); // Redirect to a protected page
    } catch (err) {
      console.error('Error signing in with Google:', err.message);
      setMsg('Error signing in with Google, please try again.');
    }
    setPopup(false);
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
      className="relative min-h-screen flex justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      data-testid="Login screen"
    >
      <div className="bg-white w-full max-w-3xl shadow-md rounded-lg p-8">
        <Toolbar />
        <strong className="text-center block mb-6 text-2xl">Sign In</strong>
        <p className="text-center block mb-2 text-l">
          Signing in allows you to unlock the full potential of QuizLing. By
          signing in, you can track your linguistic progress over time, set
          personalized goals, and enjoy full access to our achievements feature.
        </p>

        <div className="text-center">
          {msg && <h2 className="mb-4 text-red-500">{msg}</h2>}
          <br />
          {!popup && (
            <div>
              <button
                className="bg-black p-2 m-8 rounded-lg hover:bg-[#5999AE] text-white"
                onClick={handleGoogleSignIn}
              >
                Sign In with Google
              </button>
              <button
                className="bg-black p-2 m-8 rounded-lg hover:bg-[#5999AE] text-white"
                onClick={handleGuestLogin}
              >
                Continue as Guest
              </button>
            </div>
          )}

          {popup && <p>A Google popup has opened to help you log in...</p>}
        </div>
      </div>
    </div>
  );
}
