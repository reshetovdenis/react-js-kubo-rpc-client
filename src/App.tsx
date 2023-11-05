import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { create } from 'kubo-rpc-client'

const client = create({ url: "http://127.0.0.1:5001/api/v0" });

function App() {
  const [cid, setCid] = useState<string | null>(null);

  const handleButtonClick = async () => {
    try {
      const response = await client.add('Hello world!');
      setCid(response.cid.toString());  // Convert to string here
      console.log(response.cid);
    } catch (error) {
      console.error("Failed to add to client:", error);
    }
  };

  return (
    <div className="App">
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <button onClick={handleButtonClick}>Add to Client</button>
      {cid && <p>CID: {cid}</p>}
    </div>
  );
}

export default App;