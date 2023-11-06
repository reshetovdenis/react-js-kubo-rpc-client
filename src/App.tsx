import React, { useState } from 'react';
import './App.css';
import { create } from 'kubo-rpc-client'
import { getIPFSContentID, getIPFSDataFromContentID } from '@slonigiraf/helpers';

const dataToAdd = 'Some data';

const client = create({ url: 'https://ipfs.slonig.org/api/v0' });

function App() {
  const [cid, setCid] = useState<string | null>(null);
  const [retrievedData, setRetrievedData] = useState<string | null>(null);

  const handleAddButtonClick = async () => {
    try {
      const response = await getIPFSContentID(client, dataToAdd);
      setCid(response);  // Convert to string here
      console.log(response);
    } catch (error) {
      console.error("Failed to add to client:", error);
    }
  };

  const handleRetrieveButtonClick = async () => {
    try {
      if (cid) {
        const data = await getIPFSDataFromContentID(client, cid);
        setRetrievedData(data);
        console.log(data);
      }
    } catch (error) {
      console.error("Failed to retrieve from client:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={handleAddButtonClick}>Add to Client</button>
      {cid && (
        <div>
          <p>CID: <b>{cid}</b></p>
          <button onClick={handleRetrieveButtonClick}>Retrieve Data</button>
        </div>
      )}
      {retrievedData && <p>Retrieved Data: <b>{retrievedData}</b></p>}
    </div>
  );
}

export default App;