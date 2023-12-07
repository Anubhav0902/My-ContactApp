import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwogWCZxl3o9mnjBwEIp7-gZ7uftVQBi8",
  authDomain: "my-contactapp-57a57.firebaseapp.com",
  projectId: "my-contactapp-57a57",
  storageBucket: "my-contactapp-57a57.appspot.com",
  messagingSenderId: "190334334634",
  appId: "1:190334334634:web:e0414dadbd8dc57485c2d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const onAuthStateChanged = (user) => {
  if (user) {
    console.log("User is signed in, UID:", user.uid);
  } else {
    console.log("User is signed out");
  }
};
const signOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

export { app, firestore, auth, onAuthStateChanged, signOut };
