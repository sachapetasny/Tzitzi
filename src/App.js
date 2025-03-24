import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

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
const SHARE_CODE = 'sol2025';

function App() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'nursing', SHARE_CODE), (docSnap) => {
      const data = docSnap.data();
      if (data && data.history) {
        setHistory(data.history);
      }
    });
    return () => unsub();
  }, []);

  const handleNurse = async (side) => {
    const newEntry = { side, time: new Date().toISOString() };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    await setDoc(doc(db, 'nursing', SHARE_CODE), { history: newHistory });
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>Tzitzi Baby</h1>
      <button onClick={() => handleNurse('Right')}>Right</button>
      <button onClick={() => handleNurse('Left')}>Left</button>
      <ul>
        {history.map((entry, idx) => (
          <li key={idx}>
            {new Date(entry.time).toLocaleTimeString()} - {entry.side}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;