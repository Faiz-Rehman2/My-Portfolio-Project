import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "AIzaSyCDaDXe_JVTBeROghucttWeVdiZEMyQIBg",
  authDomain: "blogging-react-app-d936e.firebaseapp.com",
  projectId: "blogging-react-app-d936e",
  storageBucket: "blogging-react-app-d936e.appspot.com",
  messagingSenderId: "775153600704",
  appId: "1:775153600704:web:eeb96cfd7b8241d4fb4525"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

