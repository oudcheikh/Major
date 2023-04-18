import { initializeApp } from "firebase/app";
 import { getFunctions } from 'firebase/functions';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";




import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyCnDE-9VGEttJeZRtraFeNmVDMRCQn8VmE",
  authDomain: "majorprod-9a7e6.firebaseapp.com",
  projectId: "majorprod-9a7e6",
  storageBucket: "majorprod-9a7e6.appspot.com",
  messagingSenderId: "873947755897",
  appId: "1:873947755897:web:7eecf9f797e79a2e15aba8",
  measurementId: "G-GRMXC2RNMB"

  // apiKey: "AIzaSyBSwhTnr4zt3sqF-Wysf9SbQhrN23q2WLI",
  // authDomain: "major-24a8b.firebaseapp.com",
  // databaseURL: "https://major-24a8b-default-rtdb.europe-west1.firebasedatabase.app",
  // projectId: "major-24a8b",
  // storageBucket: "major-24a8b.appspot.com",
  // messagingSenderId: "88860572937",
  // appId: "1:88860572937:web:4b42e089552c5b5c4427d8",
  // measurementId: "G-Q9G5J16FJN"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'europe-west1');

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  functions,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
