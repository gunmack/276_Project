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
