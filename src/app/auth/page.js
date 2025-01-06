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
  signInAnonymously,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { useRouter } from 'next/navigation';
import { addUserData } from '../app_firebase';

import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const [popup, setPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();
  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user && user.displayName != null) {
          router.push('/main-menu'); // Redirect to dashboard if already signed in
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setMsg('No user is currently signed in.');
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [router]);

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

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      alert('Please enter your email and password.');
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        addUserData(user);
        router.push('/main-menu'); // Redirect to a protected page
      } catch (error) {
        // console.error('Error signing in:', error.message);
        setMsg(`An error occured, please try again.`);
        if (error.code === 'auth/invalid-credential') {
          setMsg('Incorrect email or password. Please try again.');
        } else {
          setMsg(`An error occured, please try again.`);
        }
      }
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
      className="relative min-h-screen flex justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      data-testid="Login screen"
    >
      <div className="bg-white w-full max-w-3xl shadow-md rounded-lg p-8">
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
              <div className="flex flex-col gap-4 bg-gray-100 p-8 rounded-lg">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-600 text-sm mb-2"
                  ></label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#5999AE]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-600 text-sm mb-2"
                  ></label>
                  <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#5999AE]"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-4 pt-8 justify-center items-center">
                  <button
                    onClick={() => handleLogin(email, password)}
                    className="bg-black p-2 w-1/3  rounded-lg hover:bg-[#5999AE] text-white"
                  >
                    Login
                  </button>
                </div>
                <div className="flex flex-row gap-4 pt-8 justify-center items-center">
                  <button
                    className="bg-black p-2 w-1/3 rounded-lg hover:bg-gray-700 text-white flex items-center justify-center"
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      className="w-6 h-6"
                      src="/google.png"
                      alt="Google logo"
                    />
                  </button>
                  or
                  <button
                    className="bg-black p-2 w-1/3  rounded-lg hover:bg-[#5999AE] text-white"
                    onClick={handleGuestLogin}
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
              <div className="p-8">
                <p className="text-sm text-gray-500 mt-4">
                  Don’t have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Forgot your password?{' '}
                  <Link href="/reset" className="text-blue-600 hover:underline">
                    Reset password
                  </Link>
                </p>
              </div>
            </div>
          )}

          {popup && <p>A Google popup has opened to help you log in...</p>}
        </div>
      </div>
    </div>
  );
}
