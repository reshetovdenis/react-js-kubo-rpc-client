import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { create } from 'kubo-rpc-client'

//Enable from localhost
//ipfs config show | grep "Access-Control-Allow-Origin"
//ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:5001"]'
//ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

const client = create({ url: 'http://ipfs.slonig.org/api/v0' });
//POST https://ipfs.slonig.org:5001/api/v0/add?stream-channels=true&progress=false net::ERR_SSL_PROTOCOL_ERROR

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