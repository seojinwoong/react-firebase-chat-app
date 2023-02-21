import { initializeApp } from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAW9LqCDNV0Q5vKAaTONGti0xRfRvA1LxU",
  authDomain: "react-firebase-chatapp-4.firebaseapp.com",
  projectId: "react-firebase-chatapp-4",
  storageBucket: "react-firebase-chatapp-4.appspot.com",
  messagingSenderId: "147098324643",
  appId: "1:147098324643:web:3b2b3c45f4bd24cb15f916",
  measurementId: "G-06VQ885S25"
};

const app = initializeApp(firebaseConfig);

export default app;
