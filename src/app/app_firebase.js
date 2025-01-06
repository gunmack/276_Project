import { firebaseDB } from '../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';

export async function addToQuiz(user) {
  const database = getDatabase(firebaseDB);
  const QuizCounttRef = ref(database, `Users/${user.displayName}/QuizCount`);
  const count = await get(QuizCounttRef);
  let newCount = 1;
  if (count.exists()) {
    newCount = count.val() + 1;
  }
  try {
    await set(QuizCounttRef, newCount);
  } catch (error) {
    console.error(error);
  }
}

export async function addToFlashCards(user) {
  const database = getDatabase(firebaseDB);
  const FlashCardCountRef = ref(
    database,
    `Users/${user.displayName}/FlashCardCount`
  );
  const count = await get(FlashCardCountRef);
  let newCount = 1;
  if (count.exists()) {
    newCount = count.val() + 1;
  }
  try {
    await set(FlashCardCountRef, newCount);
  } catch (error) {
    console.error(error);
  }
}

export async function addToAImsg(user) {
  const database = getDatabase(firebaseDB);
  const AImsgCountRef = ref(database, `Users/${user.displayName}/AImsgCount`);
  const count = await get(AImsgCountRef);
  let newCount = 1;
  if (count.exists()) {
    newCount = count.val() + 1;
  }
  try {
    await set(AImsgCountRef, newCount);
  } catch (error) {
    console.error(error);
  }
}

export async function addUserData(user) {
  const database = getDatabase(firebaseDB);

  if (!user || !user.displayName) {
    // console.error('Invalid user data.');
    alert('Invalid sign up data, please try again.');
    return;
  }

  const userRef = ref(database, `Users/${user.displayName}`);

  try {
    // Check if the user already exists
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      alert('Welcome back ' + user.displayName);
      return;
    }

    const newUserData = {
      displayName: user.displayName
    };
    // Create a reference to the user count
    const userCountRef = ref(database, 'Users/userCount');

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
}
