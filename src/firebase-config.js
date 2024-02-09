
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import  { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVofB9hMHkeO43B1rd1JBVGE2rD1SiZuE",
  authDomain: "complaint-bo.firebaseapp.com",
  databaseURL: "https://complaint-bo-default-rtdb.firebaseio.com",
  projectId: "complaint-bo",
  storageBucket: "complaint-bo.appspot.com",
  messagingSenderId: "804053260370",
  appId: "1:804053260370:web:4dac7f81ca6617e950678b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage = getStorage(app)
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
