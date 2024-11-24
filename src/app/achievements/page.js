'use client';
import React, { useEffect, useState } from 'react';
import Toolbar from '../Toolbar';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { firebaseDB } from '../../../firebase_config';

export default function Achievements() {
  const { user } = useAuth();
  const [msg, setMsg] = useState('Please login to view your achievements');
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user && user.displayName) {
      setUserName(user.displayName);
      setMsg(`Keep it up, ${user.displayName}!`);
      // Initialize the Firebase database with the provided configuration
      const database = getDatabase(firebaseDB);

      // Reference to the 'Users/Jack' path in the database
      const userRef = ref(database, `Users/${user.displayName}/`);

      // Listen for changes at the 'Users/{user.displayName}' path
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);

        // Check if data exists
        if (data) {
          // Set vocab count and flashcard count
          setUserData(data);
        } else {
          console.log('No data found');
        }
      });
    }
  }, [user]);

  return (
    <>
      <div
        data-testid="Achievements"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Achievements</h1>
            <h2>{msg}</h2>
            {userName && (
              <div className="flex flex-col space-y-4 p-4">
                {/* Check if userData is available before rendering */}
                {userData ? (
                  <div className="flex flex-col space-y-8 px-8 m-8">
                    <div className="flex justify-between">
                      <strong>Username: ....</strong>
                      <span>{userData.displayName}</span>
                    </div>

                    <div className="flex justify-between ">
                      <strong>Word/Phrases learnt:</strong>
                      <span>{userData.VocabCount || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <strong>Flashcards studied:</strong>
                      <span>{userData.FlashCardCount || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <strong>Quizzes passed:</strong>
                      <span>{userData.QuizCount || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <strong>Messages sent :</strong>
                      <span>{userData.AImsgCount || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <strong>Pronunciations learnt:</strong>
                      <span> {userData.ttsCount || 0}</span>
                    </div>
                  </div>
                ) : (
                  <p>Loading user data...</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
