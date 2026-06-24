import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
doc,
getDoc,
updateDoc,
getDocs,
query,
where,
deleteDoc,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyCB42qUEnt2GjryCGJNENlP3zOKcdlkyQc",
authDomain: "cyberpanel-7456a.firebaseapp.com",
projectId: "cyberpanel-7456a",
storageBucket: "cyberpanel-7456a.firebasestorage.app",
messagingSenderId: "11087232004",
appId: "1:11087232004:web:7242c0548a43c15730c951"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {
db,
auth,

collection,
addDoc,
doc,
getDoc,
updateDoc,
getDocs,
query,
where,
deleteDoc,
onSnapshot,

signInWithEmailAndPassword,
onAuthStateChanged,
signOut
};