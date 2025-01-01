import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAernJjecugL_XiInVM7M77ex1B5tUhx7Q",
  authDomain: "vanapp-2b8e5.firebaseapp.com",
  projectId: "vanapp-2b8e5",
  storageBucket: "vanapp-2b8e5.firebasestorage.app",
  messagingSenderId: "102334885348",
  appId: "1:102334885348:web:cd7b4a1dd7689272e4abf1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = getFirestore(app);
