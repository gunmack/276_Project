'use client';
import React from 'react';
import Toolbar from '../Toolbar';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Quizzes() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth'); // Redirect to login page if not logged in
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }
  return (
    <>
      <div
        data-testid="Quizzes"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
        style={{
          background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
        }}
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Quizzes</h1>
          </div>
        </main>
      </div>
    </>
  );
}
