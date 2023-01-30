// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAgr1ZTUcWiiLoPndfQXCfhdl_0-xat1pI",
  authDomain: "schoolep-67cf5.firebaseapp.com",
  projectId: "schoolep-67cf5",
  storageBucket: "schoolep-67cf5.appspot.com",
  messagingSenderId: "1064916349539",
  appId: "1:1064916349539:web:491bfede35a0759dc67e56",
  measurementId: "G-CF7ZPG9FR3",
  databaseURL: "https://schoolep-67cf5-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rdb = getDatabase(app);
const sdb = getStorage(app)
const auth = getAuth(app);

export { db, rdb, sdb, auth }
export default app
