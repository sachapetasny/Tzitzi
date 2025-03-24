import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

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
      fontWeight: 'bold',
      color: '#d45d79'
    }}
    title={`הנקת צד ${side}`}
  >
    ●
  </button>
);

function App() {
  const [shareCode, setShareCode] = useState(localStorage.getItem('shareCode') || '');
  const [tempCode, setTempCode] = useState('');
  const [history, setHistory] = useState([]);
  const [lastTime, setLastTime] = useState(null);

  useEffect(() => {
    if (!shareCode) return;
    const unsub = onSnapshot(doc(db, 'nursing', shareCode), (docSnap) => {
      const data = docSnap.data();
      if (data?.history) {
        setHistory(data.history);
        if (data.history.length > 0) {
          setLastTime(new Date(data.history[0].time));
        }
      }
    });
    return () => unsub && unsub();
  }, [shareCode]);

  const saveHistory = async (newHistory) => {
    setHistory(newHistory);
    await setDoc(doc(db, 'nursing', shareCode), { history: newHistory });
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

  if (!shareCode) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h3>הזן קוד שיתוף</h3>
        <input
          value={tempCode}
          onChange={(e) => setTempCode(e.target.value)}
          placeholder="למשל: sol2025"
          style={{ fontSize: 18, padding: 10, textAlign: 'center' }}
        />
        <div>
          <button
            onClick={() => {
              if (tempCode.trim()) {
                localStorage.setItem('shareCode', tempCode.trim());
                setShareCode(tempCode.trim());
              }
            }}
            style={{ marginTop: 20, padding: '10px 20px', fontSize: 16 }}
          >
            התחבר
          </button>
        </div>
      </div>
    );
  }

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
