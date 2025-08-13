// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-57179.firebaseapp.com",
  projectId: "mern-estate-57179",
  storageBucket: "mern-estate-57179.firebasestorage.app",
  messagingSenderId: "531887632696",
  appId: "1:531887632696:web:c1fb686f0d5661f1a711cd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
