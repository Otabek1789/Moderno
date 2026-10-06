import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase konfiguratsiyasi (.env dan yoki to'g'ridan-to'g'ri o'qiladi)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-6jBm5gwWL9RjvdZNjp_uzoOz7xKMaM8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "moderno-2af2f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "moderno-2af2f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "moderno-2af2f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "84588217858",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:84588217858:web:abba69e2db888489fe891b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-97FJ3RD9YC"
};

let app = null;
let auth = null;
let googleProvider = null;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.authDomain
);

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    // Foydalanuvchiga har safar akkaunt tanlash oynasini ko'rsatish
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, googleProvider, signInWithPopup, firebaseConfig };
