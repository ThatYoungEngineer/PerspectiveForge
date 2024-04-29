// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "perspectiveforge-2843b.firebaseapp.com",
  projectId: "perspectiveforge-2843b",
  storageBucket: "perspectiveforge-2843b.appspot.com",
  messagingSenderId: "380478000024",
  appId: "1:380478000024:web:39a0b4fbd267497b3d39ed",
  measurementId: "G-TZLE5B476K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
