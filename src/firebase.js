import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARxNBZKc8sWGNBxxmL-m9aiX-lbPc3KjU",
  authDomain: "react-chat-app-exercise.firebaseapp.com",
  projectId: "react-chat-app-exercise",
  storageBucket: "react-chat-app-exercise.appspot.com",
  messagingSenderId: "335344283258",
  appId: "1:335344283258:web:e83a02cc8018c13b6055c3",
  measurementId: "G-4HT9854YGE"
};

const app = initializeApp(firebaseConfig);

export default app;