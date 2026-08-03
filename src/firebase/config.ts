'use client';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "", // Provided by the environment
  authDomain: "reflexes-ar.firebaseapp.com",
  projectId: "reflexes-ar",
  storageBucket: "reflexes-ar.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
