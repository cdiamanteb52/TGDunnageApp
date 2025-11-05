import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

initializeApp(firebaseConfig);
const db = getFirestore();

export default function App() {
  const [parts, setParts] = useState([]);
  useEffect(() => {
    const path = "artifacts/dev/public/data/partCatalog"; // change appId as needed
    const q = query(collection(db, path));
    const unsub = onSnapshot(q, (snapshot) => {
      setParts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>TG Dunnage — Part Catalog (dev)</h1>
      <p>Realtime PartCatalog feed (read-only)</p>
      <ul>
        {parts.slice(0, 100).map(p => (
          <li key={p.id}>
            <strong>{p.partNumber}</strong> — team: {p.team} cell: {p.cell} PH: {p.phStd || "N/A"} PK: {p.pk || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
