import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCvZrBbPVYjxhQ4t5kMryu90sCRjX9pLws',
  authDomain: 'real-time-chatting-app-feb89.firebaseapp.com',
  projectId: 'real-time-chatting-app-feb89',
  storageBucket: 'real-time-chatting-app-feb89.appspot.com',
  messagingSenderId: '1006473635569',
  appId: '1:1006473635569:web:a7ad599968bcf266feeb50',
  measurementId: 'G-4HQG2QJS9G',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
