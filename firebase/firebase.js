import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCI8ELlV0Jjlh2gIAJe0VjA8mY1aaihx48",
  authDomain: "howler-58fee.firebaseapp.com",
  projectId: "howler-58fee",
  storageBucket: "howler-58fee.appspot.com",
  messagingSenderId: "920134743477",
  appId: "1:920134743477:web:b82ffb4985e6febf3155fc",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

export default app;
export { db, storage, auth };
