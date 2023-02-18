import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAqPdxiyytcoIELu9efAZcu2dPclZIdK_g",
    authDomain: "react-firebase-chatapp-3.firebaseapp.com",
    projectId: "react-firebase-chatapp-3",
    storageBucket: "react-firebase-chatapp-3.appspot.com",
    messagingSenderId: "86095112595",
    appId: "1:86095112595:web:364ab6258c5800b923a066"
  };

const app = initializeApp(firebaseConfig);

export default app;