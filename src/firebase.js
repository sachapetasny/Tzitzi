import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJ3YdKUdS2FH8VS8Q1SkgFL_s_TI85sGo",
  authDomain: "tzitzi-baby.firebaseapp.com",
  projectId: "tzitzi-baby",
  storageBucket: "tzitzi-baby.firebasestorage.app",
  messagingSenderId: "377401958141",
  appId: "1:377401958141:web:11273403c92f55ee15e894"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
