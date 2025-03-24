import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const SHARE_CODE = 'sol2025';

const BreastButton = ({ side, onClick }) => (
  <button
    onClick={() => onClick(side)}
    style={{
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: '#fde2e4',
      margin: 10,
      border: '2px solid #f08a5d',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 28,
      fontWeight: 'bold'
    }}
    title={`הנקת צד ${side}`}
  >
    ●
  </button>
);

function App() {
  const [history, setHistory] = useState([]);
  const [lastTime, setLastTime] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'nursing', SHARE_CODE), (docSnap) => {
      const data = docSnap.data();
      if (data?.history) {
        setHistory(data.history);
        if (data.history.length > 0) {
          setLastTime(new Date(data.history[0].time));
        }
      }
    });
    return () => unsub();
  }, []);

  const saveHistory = async (newHistory) => {
    setHistory(newHistory);
    await setDoc(doc(db, 'nursing', SHARE_CODE), { history: newHistory });
  };

  const handleNurse = async (side) => {
    const newEntry = { side, time: new Date().toISOString() };
    await saveHistory([newEntry, ...history]);
  };

  const handleDelete = async (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    await saveHistory(newHistory);
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
        <BreastButton side='ימין' onClick={handleNurse} />
        <BreastButton side='שמאל' onClick={handleNurse} />
      </div>
      {lastTime && (
        <div style={{ marginBottom: 10, color: '#666' }}>
          הנקה אחרונה: {lastTime.toLocaleString()} ({history[0]?.side})
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((entry, index) => (
          <li key={index} style={{ marginBottom: 6 }}>
            {new Date(entry.time).toLocaleTimeString()} - {entry.side}
            <button
              onClick={() => handleDelete(index)}
              style={{
                marginLeft: 10,
                color: 'red',
                border: 'none',
                background: 'transparent',
                fontWeight: 'bold'
              }}
              title='מחק'
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
