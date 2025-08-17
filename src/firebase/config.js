// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4vI5eYOPISdmo7Fgpfw50DAgnlIvJ-xc",
  authDomain: "diuevents-3ecd4.firebaseapp.com",
  projectId: "diuevents-3ecd4",
  storageBucket: "diuevents-3ecd4.firebasestorage.app",
  messagingSenderId: "618114582605",
  appId: "1:618114582605:web:030307dfcc378e35ba7404",
  measurementId: "G-40ZESXMEXR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
