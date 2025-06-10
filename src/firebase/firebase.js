import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsDubKSTVnuU1uY0MMi19h-Wi-YVXYIU8",
  authDomain: "kesek-3725f.firebaseapp.com",
  projectId: "kesek-3725f",
  storageBucket: "kesek-3725f.firebasestorage.app",
  messagingSenderId: "43998546759",
  appId: "1:43998546759:web:2e4396dba40ae6a57d5a62",
  measurementId: "G-Q12G9X4JHE"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);


export const login = async (e, p) => {
  await signInWithEmailAndPassword(auth, e, p)
};

export const logout = () => signOut(auth);

export const usersRef = collection(db, "users")