import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { create, IPFSHTTPClient, CID} from 'kubo-rpc-client'
// import { getIPFSContentID, getIPFSDataFromContentID } from '@slonigiraf/helpers';

// A helper wrapper to get IPFS CID from a text
export async function getIPFSContentID(ipfs: IPFSHTTPClient, content: string): Promise<string> {
  const { cid } = await ipfs.add(content);
  return cid.toString();
}

// A helper wrapper to get a text from IPFS CID
export async function getIPFSDataFromContentID(ipfs: IPFSHTTPClient, cidStr: string): Promise<string> {
  const cid = CID.parse(cidStr);
  
  const chunks: Uint8Array[] = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }
  
  // Calculate the total length of all chunks combined
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  
  // Create a new Uint8Array with the total length
  const combinedChunks = new Uint8Array(totalLength);
  
  // Use the `set` method to copy each chunk into the correct position
  let offset = 0;
  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset);
    offset += chunk.length;
  }
  
  // Convert the combined Uint8Array to a string
  return new TextDecoder().decode(combinedChunks);
}


// Enable from localhost
// ... [Your ipfs config commands here]

const client = create({ url: 'http://ipfs.slonig.org/api/v0' });

async function dataFromCid(ipfs: any, cid: string) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }

  // Calculate the total length of all chunks combined
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);

  // Create a new Uint8Array with the total length
  const combinedChunks = new Uint8Array(totalLength);

  // Use the `set` method to copy each chunk into the correct position
  let offset = 0;
  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset);
    offset += chunk.length;
  }

  // Convert the combined Uint8Array to a string
  return new TextDecoder().decode(combinedChunks);
}


function App() {
  const [cid, setCid] = useState<string | null>(null);
  const [retrievedData, setRetrievedData] = useState<string | null>(null);

  const handleAddButtonClick = async () => {
    try {
      // const response = await client.add('Hello world123ldkfsdlfs!');
      const response = await getIPFSContentID(client,'Hello world123ldkfsdlfs!');
      
      setCid(response);  // Convert to string here
      console.log(response);
    } catch (error) {
      console.error("Failed to add to client:", error);
    }
  };

  const handleRetrieveButtonClick = async () => {
    try {
      if (cid) {
        const data = await dataFromCid(client, cid);
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
          <p>CID: {cid}</p>
          <button onClick={handleRetrieveButtonClick}>Retrieve Data</button>
        </div>
      )}
      {retrievedData && <p>Retrieved Data: {retrievedData}</p>}
    </div>
  );
}

export default App;