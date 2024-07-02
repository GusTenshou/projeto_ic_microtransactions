import React, { useState } from "react";

const HashManagement = () => {
  const [inputKey, setInputKey] = useState("");
  const [selectKey, setSelectKey] = useState("");
  const [hashChain, setHashChain] = useState<string[]>([]);
  const [currentHashKey, setCurrentHashKey] = useState("");

  const handleInputKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(event.target.value);
  };

  const handleSelectKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectKey(event.target.value);
  };

  const fetchHashChain = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Fetching hash chain for key:", inputKey);
    chrome.storage.local.get("hashChains", (result) => {
      console.log("Fetched hashChains from storage:", result.hashChains);
      const hashChains: HashObject[] = result.hashChains || [];
      const hashObject = hashChains.find((obj) => obj.key === inputKey);
      if (hashObject) {
        console.log("Found hashObject:", hashObject);
        setHashChain(hashObject.hashchain);
        setInputKey("");
      } else {
        console.log("No hash chain available or error in fetching.");
        setHashChain([]);
        setInputKey("");
      }
    });
  };

  const handleHashSelect = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectKey) {
      chrome.storage.local.set({ selectedKey: selectKey });
      setSelectKey("");
    }
  };

  const fetchCurrentHashKey = () => {
    chrome.storage.local.get("selectedKey", (result) => {
      setCurrentHashKey(result.selectedKey || "");
    });
  };

  return (
    <div>
      <form onSubmit={fetchHashChain}>
        <input
          type="text"
          value={inputKey}
          onChange={handleInputKey}
          placeholder="Digite a chave"
        />
        <button type="submit">Show hash chain</button>
      </form>
      <form onSubmit={handleHashSelect}>
        <input
          type="text"
          value={selectKey}
          onChange={handleSelectKey}
          placeholder="Digite a chave para selecionar"
        />
        <button type="submit">Select hash chain</button>
      </form>
      <button onClick={fetchCurrentHashKey}>Get Current Hash Key</button>
      <p>Current Hash Key: {currentHashKey}</p>
      <ul>
        {hashChain.length > 0 ? (
          hashChain.map((hash, index) => <li key={index}>{hash}</li>)
        ) : (
          <li>No hash chain found</li>
        )}
      </ul>
    </div>
  );
};

interface HashObject {
  address_contract: string;
  address_to: string;
  length: number;
  hashchain: string[];
  isValid: boolean;
  key: string;
  tail: string;
}

export default HashManagement;
