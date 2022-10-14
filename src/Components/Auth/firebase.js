import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/messaging";

const config = {
  apiKey: "AIzaSyBMLI-J4ceUWCSOzensKC2uwDEJEGwWaT8",
  authDomain: "chat-app-115ec.firebaseapp.com",
  projectId: "chat-app-115ec",
  storageBucket: "chat-app-115ec.appspot.com",
  messagingSenderId: "439453075347",
  appId: "1:439453075347:web:6fd9b57e78af6185a84a66",
  measurementId: "G-MTY8J9Z35W",
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
