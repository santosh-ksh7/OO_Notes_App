import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: "notes-89df2.firebaseapp.com",
    projectId: "notes-89df2",
    storageBucket: "notes-89df2.appspot.com",
    messagingSenderId: "384297188673",
    appId: "1:384297188673:web:46c84a6fb1372e9a2fb5c0"
};


// Initialize the firebase within the react app 
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

// export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);