import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-Yf5tn-Vw7heMWrAxwf-E9zN-QnoURMw",
  authDomain: "camisa-pro.firebaseapp.com",
  projectId: "camisa-pro",
  storageBucket: "camisa-pro.firebasestorage.app",
  messagingSenderId: "91564079628",
  appId: "1:91564079628:web:a8fc3eb657d153e1f78c29",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
export const db = getFirestore(app);
