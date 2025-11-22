// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0vBvf29NmfWywAUuojko_SjnYE--dATk",
  authDomain: "vuvisa-fa0be.firebaseapp.com",
  projectId: "vuvisa-fa0be",
  storageBucket: "vuvisa-fa0be.firebasestorage.app",
  messagingSenderId: "216349052349",
  appId: "1:216349052349:web:3f74be3b6d3711740c96d4",
  measurementId: "G-L8Z21M4JGC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { app, auth, facebookProvider, googleProvider };
