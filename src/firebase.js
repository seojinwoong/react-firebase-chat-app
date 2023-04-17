import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLCDvGGvFnZlYleAxwgiN35gDP7xdWdsg",
  authDomain: "react-firebase-chatapp-74bab.firebaseapp.com",
  projectId: "react-firebase-chatapp-74bab",
  storageBucket: "react-firebase-chatapp-74bab.appspot.com",
  messagingSenderId: "1012804657761",
  appId: "1:1012804657761:web:1909097065e792f931c020",
  measurementId: "G-WFZJRDJD5Q"
};

const app = initializeApp(firebaseConfig);

export default app;