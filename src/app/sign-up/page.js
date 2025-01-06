/**
 * Sign-up page component
 */

'use client';
import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

import { addUserData } from '../app_firebase';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpBox() {
  const auth = getAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignUp = async (formData) => {
    if (
      formData.username === '' ||
      formData.email === '' ||
      formData.password === ''
    ) {
      alert('One or more fields are empty. Please fill in all fields.');
    } else {
      try {
        // Ensure you await the Firebase sign-up function
        const result = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = result.user;
        // Update the user's display name
        await updateProfile(user, {
          displayName: formData.username
        });
        alert('Welcome, ' + formData.username + '!');
        // Save user data in Firebase database
        await addUserData(user);
        // Navigate to the main menu
        router.push('/main-menu');
      } catch (error) {
        // Provide user-friendly error messages
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already in use. Please use a different email.');
        } else if (error.code === 'auth/invalid-email') {
          alert('Invalid email format. Please enter a valid email.');
        } else if (error.code === 'auth/weak-password') {
          alert('Password is too weak. Please use a stronger password.');
        } else {
          alert(`Error signing up: ${error.message}`);
        }
      }
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Sign Up</h1>
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-600 text-sm mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-600 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#5999AE]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#5999AE]"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-4 pt-8 justify-center items-center">
            <button
              onClick={() => handleSignUp(formData)}
              className="bg-black p-2 w-1/2  rounded-lg hover:bg-[#5999AE] text-white"
            >
              Sign Up
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/auth" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
