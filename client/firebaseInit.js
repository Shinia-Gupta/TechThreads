import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBMWNFCSHgoKi1uWVZnueMAS-KCXfwGh2g",
  authDomain: "mern-blog-3a3a1.firebaseapp.com",
  projectId: "mern-blog-3a3a1",
  storageBucket: "mern-blog-3a3a1.appspot.com",
  messagingSenderId: "287799501767",
  appId: "1:287799501767:web:45b36518c901b268cb2fe2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

