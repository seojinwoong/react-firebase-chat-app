import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhZdwqhEEK7Fpp0uiyQeI9VpzM2yyRILY",
  authDomain: "react-firebase-chatapp-f0033.firebaseapp.com",
  projectId: "react-firebase-chatapp-f0033",
  storageBucket: "react-firebase-chatapp-f0033.appspot.com",
  messagingSenderId: "833646238919",
  appId: "1:833646238919:web:521cec5c90d1fd520032e2",
  measurementId: "G-9SWKF9RM2E"
};

const app = initializeApp(firebaseConfig);

export default app;
