// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { execOnce } from 'next/dist/shared/lib/utils';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD2MiQS9LJMwXh2E6w8vvidHFLfcP8y2FQ',
  authDomain: 'db12-d9987.firebaseapp.com',
  databaseURL: 'https://db12-d9987-default-rtdb.firebaseio.com',
  projectId: 'db12-d9987',
  storageBucket: 'db12-d9987.firebasestorage.app',
  messagingSenderId: '57972114935',
  appId: '1:57972114935:web:ba2f76a90877c40f0adaf2',
  measurementId: 'G-DRB96G46CB'
};

// Initialize Firebase
const firebaseDB = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebaseDB;
