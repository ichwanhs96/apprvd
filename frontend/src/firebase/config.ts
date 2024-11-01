import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "apprvd-auth.firebaseapp.com",
    projectId: "apprvd-auth",
    storageBucket: "apprvd-auth.firebasestorage.app",
    messagingSenderId: "731221718536",
    appId: "1:731221718536:web:a7a2663c2f7bc1abb383bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);