/**
 * Login page component
 */

'use client';
import React, { useState, useEffect } from 'react';
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
    <div className="text-center p-8" data-testid="Login screen">
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
