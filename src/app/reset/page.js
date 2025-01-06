'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent successfully. Check your inbox!');
        setError('');
      } catch (error) {
        setError(
          `${error.message} Failed to send password reset email. Please try again.`
        );
        setSuccess('');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Reset Password
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 text-sm mb-2">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#5999AE]"
              placeholder="Email address"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            onClick={() => {
              handleForgotPassword(email);
            }}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Send Reset Email
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Remembered your password?{' '}
          <Link href="/auth" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
