// import functions of firebase for inicialition
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

//Paste here your own firebaseConfig
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
  databaseURL: "",
};

//inicialition function
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rdb = getDatabase(app);
const sdb = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, rdb, sdb, auth, analytics };
export default app;
