import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB2dHJru6_JAmpMTjIl5r7esu3KREx7ZLw',
  authDomain: 'real-time-chat-app-77c71.firebaseapp.com',
  projectId: 'real-time-chat-app-77c71',
  storageBucket: 'real-time-chat-app-77c71.appspot.com',
  messagingSenderId: '736803060338',
  appId: '1:736803060338:web:1cd1557c0cb7f311dea0eb',
  measurementId: 'G-CJTRFLRQVY',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
