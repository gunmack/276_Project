'use client';
import React, { useEffect, useState } from 'react';
import Toolbar from '../components/Toolbar';
import { signOut } from 'firebase/auth';

import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import { firebaseDB } from '../../../firebase_config';

export default function Achievements() {
  const { user } = useAuth();
  const [msg, setMsg] = useState('');
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState({});
  const [hasData, setHasData] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [showPopup, setShowPopup] = useState(false);

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const Achievements = [
    {
      level: 'Beginner',
      criteria: [
        { key: 'VocabCount', value: 10, description: 'Words/Phrases learned' },
        { key: 'FlashCardCount', value: 5, description: 'Flash cards studied' },
        { key: 'QuizCount', value: 10, description: 'Quizzes passed' },
        { key: 'AImsgCount', value: 20, description: 'Chatbot messages sent' },
        { key: 'ttsCount', value: 5, description: 'Pronunciations learned' }
      ]
    },
    {
      level: 'Intermediate',
      criteria: [
        { key: 'VocabCount', value: 20, description: 'Words/Phrases learned' },
        {
          key: 'FlashCardCount',
          value: 10,
          description: 'Flash cards studied'
        },
        { key: 'QuizCount', value: 20, description: 'Quizzes passed' },
        { key: 'AImsgCount', value: 40, description: 'Chatbot messages sent' },
        { key: 'ttsCount', value: 10, description: 'Pronunciations learned' }
      ]
    },
    {
      level: 'Advanced',
      criteria: [
        { key: 'VocabCount', value: 40, description: 'Words/Phrases learned' },
        {
          key: 'FlashCardCount',
          value: 20,
          description: 'Flash cards studied'
        },
        { key: 'QuizCount', value: 40, description: 'Quizzes passed' },
        { key: 'AImsgCount', value: 80, description: 'Chatbot messages sent' },
        { key: 'ttsCount', value: 20, description: 'Pronunciations learned' }
      ]
    }
  ];
  const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;

    return (
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${Math.min(100, percentage)}%` }}
        ></div>
      </div>
    );
  };

  const handleDeleteAccount = () => {
    console.log('Account deleted.');
    setShowConfirm(false); // Close the popup after deletion
    DeleteAccount();
  };

  useEffect(() => {
    if (user && user.displayName) {
      setUserName(user.displayName);
      setMsg(`Keep it up, ${user.displayName}!`);
      // Initialize the Firebase database with the provided configuration
      const database = getDatabase(firebaseDB);

      const userRef = ref(database, `Users/${user.displayName}/`);

      // Listen for changes at the 'Users/{user.displayName}' path
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);

        // Check if data exists
        if (data) {
          // Set vocab count and flashcard count
          setUserData(data);
          setHasData(true);
        } else {
          console.log('No data found');
        }
      });
    } else {
      setMsg('Please log in to view your achievements.');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Success! Your account has been deleted.'); // Sign out the user
      router.push('/logout');
    } catch (error) {
      console.error('Error logging out:', error); // Log any errors
      alert('An error occurred while logging out. Please try again.');
    }
  };

  const DeleteAccount = async () => {
    // Initialize the Firebase database with the provided configuration
    const database = getDatabase(firebaseDB);

    const userRef = ref(database, `Users/${userName}/`);

    // Delete the user data
    await update(userRef, {
      displayName: null,
      VocabCount: null,
      FlashCardCount: null,
      QuizCount: null,
      AImsgCount: null,
      ttsCount: null
    });

    const user = ref(database, `Users/`);

    // Create a reference to the user count
    const userCountRef = ref(database, 'Users/UserCount');

    const userCountSnapshot = await get(userCountRef);
    // Default if the count doesn't exist

    let newUserCount = 0; // Default if the count doesn't exist

    if (userCountSnapshot.exists() && userCountSnapshot.val() > 0) {
      newUserCount = userCountSnapshot.val() - 1;
    }
    await update(user, {
      [userName]: null,
      UserCount: newUserCount
    });

    setUserData({});
    handleSignOut();
  };

  return (
    <>
      <div
        data-testid="Achievements"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
                <h2 className="text-2xl font-bold mb-4">
                  Welcome to Achievements!
                </h2>
                <p className="text-gray-700 mb-6">
                  Use this feature to track your progress. Select a difficulty
                  to see how close you are to mastering different features.
                </p>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:text-black fixed top-4 right-4 flex items-center justify-center w-16 h-16"
          >
            ❔
          </button>
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <div className="achievement-container">
              {userName && !hasData && <p>Loading...</p>}
              {!userName && !hasData && <h2>{msg}</h2>}
              {userName && hasData && (
                <div>
                  <div className="mt-4 bg-black text-white p-2 rounded-md">
                    <label
                      htmlFor="levelSelect"
                      className=" bg-black text-white"
                    >
                      Select Level:{' '}
                    </label>
                    <select
                      id="levelSelect"
                      value={selectedLevel}
                      onChange={handleLevelChange}
                      className="p-2 border rounded-md  bg-black text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  {/* Check if userData is available before rendering */}
                  {userData ? (
                    <div className="flex flex-col space-y-8  m-8">
                      {Achievements.find(
                        (tier) => tier.level === selectedLevel
                      ).criteria.map((item) => (
                        <div key={item.key} className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <strong>{item.description}:</strong>
                          </div>
                          <div className="w-3/3 flex items-center gap-4">
                            <span>
                              {Math.min(userData[item.key] || 0, item.value)}/
                              {item.value}
                            </span>
                            <ProgressBar
                              value={userData[item.key] || 0}
                              max={item.value}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Loading user data...</p>
                  )}
                </div>
              )}
            </div>
            {userName && (
              <button
                className="clear-button"
                onClick={() => setShowConfirm(true)} // Show the confirmation modal
              >
                Delete Account
              </button>
            )}

            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-bold mb-4">
                    Are you sure you want to delete your account?
                  </h2>
                  <p className="mb-4">This action cannot be undone.</p>
                  <div className="flex justify-end ">
                    <button
                      className="clear-button"
                      onClick={handleDeleteAccount} // Proceed with deletion
                    >
                      Delete
                    </button>
                    <button
                      className="translate-button"
                      onClick={() => setShowConfirm(false)} // Close the modal
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
