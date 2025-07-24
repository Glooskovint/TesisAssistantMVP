import { initializeApp } from 'firebase/app';
import { getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDWjj-qJTDj_iTgXni7WZwVKVPYk7UrOA8",
  authDomain: "tesisassistant-mvp.firebaseapp.com",
  projectId: "tesisassistant-mvp",
  storageBucket: "tesisassistant-mvp.firebasestorage.app",
  messagingSenderId: "1038381369139",
  appId: "1:1038381369139:web:86d4cb53d88b7f1eef2046"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;