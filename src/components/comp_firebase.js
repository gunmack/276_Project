import { firebaseDB } from '../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';

export async function addToVocab(user) {
  const database = getDatabase(firebaseDB);
  const vocabCountRef = ref(database, `Users/${user.displayName}/VocabCount`);
  const count = await get(vocabCountRef);
  let newCount = 1;
  if (count.exists()) {
    newCount = count.val() + 1;
  }
  try {
    await set(vocabCountRef, newCount);
  } catch (error) {
    console.error(error);
  }
}

export async function addToTts(user) {
  const database = getDatabase(firebaseDB);
  const ttsCountRef = ref(database, `Users/${user.displayName}/ttsCount`);
  const count = await get(ttsCountRef);
  let newCount = 1;
  if (count.exists()) {
    newCount = count.val() + 1;
  }
  try {
    await set(ttsCountRef, newCount);
  } catch (error) {
    console.error(error);
  }
}
