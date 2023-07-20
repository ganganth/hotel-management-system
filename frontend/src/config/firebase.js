// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIjO5avRLQS0xXLlhF32Yi4KiS6wCOqnQ",
  authDomain: "hotelmanagement-2553b.firebaseapp.com",
  projectId: "hotelmanagement-2553b",
  storageBucket: "hotelmanagement-2553b.appspot.com",
  messagingSenderId: "907630884325",
  appId: "1:907630884325:web:b7a478d5b1026c4a896b0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);