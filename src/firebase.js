import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD1MS21ryRZRCHGBJUUpJoyDmLAeLqb0Rg",
    authDomain: "snapshots-f4e7e.firebaseapp.com",
    databaseURL: "https://snapshots-f4e7e.firebaseio.com",
    projectId: "snapshots-f4e7e",
    storageBucket: "snapshots-f4e7e.appspot.com",
    messagingSenderId: "427049015020",
    appId: "1:427049015020:web:263aef62d9340a277bf7c9",
    measurementId: "G-XQNEPV8ZEH"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }; 