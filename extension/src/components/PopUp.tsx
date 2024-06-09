import React, { useState } from "react";

const Popup = () => {
  const [inputSecret, setInputSecret] = useState("");
  const [inputLength, setInputLength] = useState<number | "">(""); // Allows starting as an empty string and accepting numbers
  const [hashChain, setHashChain] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState("");
  const [selectKey, setSelectKey] = useState("");
  const [currentHashKey, setCurrentHashKey] = useState("");

  const handleInputKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(event.target.value);
  };

  const handleSelectKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectKey(event.target.value);
  };

  const handleInputSecret = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSecret(event.target.value);
  };

  const handleInputLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(event.target.value === "" ? "" : Number(event.target.value)); // Converts input to a number
  };

  const handleHashSelect = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectKey) {
      chrome.runtime.sendMessage(
        { action: "changeHashChain", data: { key: selectKey } }, // Ensuring the key is wrapped in an object
        (response) => {
          console.log("Background response", response);
        }
      );
      setSelectKey("");
    }
  };

  const handleHashSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputSecret && inputLength && inputKey) {
      chrome.runtime.sendMessage(
        {
          action: "makeHashChain",
          data: { secret: inputSecret, length: inputLength, key: inputKey },
        },
        (response) => {
          console.log("Response from background:", response);
          setInputSecret("");
          setInputLength("");
          setInputKey("");
        }
      );
    }
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

  const fetchCurrentHashKey = () => {
    chrome.runtime.sendMessage({ action: "getHashKey" }, (response) => {
      console.log("Current hash key from background:", response.data);
      setCurrentHashKey(response.data);
    });
  };

  return (
    <div>
      <form onSubmit={handleHashSubmit}>
        <input
          type="text"
          value={inputSecret}
          onChange={handleInputSecret}
          placeholder="Digite o segredo"
        />
        <input
          type="number"
          value={inputLength}
          onChange={handleInputLength}
          placeholder="Digite o comprimento"
          min="1" // Sets a minimum value
        />
        <input
          type="text"
          value={inputKey}
          onChange={handleInputKey}
          placeholder="Digite a chave"
        />
        <button type="submit">Gerar Hash</button>
      </form>
      <form onSubmit={fetchHashChain}>
        <input
          type="text"
          value={inputKey}
          onChange={handleInputKey}
          placeholder="Digite a chave"
        />
        <button type="submit">Exibir Hash Chain</button>
      </form>
      <form onSubmit={handleHashSelect}>
        <input
          type="text"
          value={selectKey}
          onChange={handleSelectKey}
          placeholder="Digite a chave para selecionar"
        />
        <button type="submit">Selecionar Hash Chain</button>
      </form>
      <button onClick={fetchCurrentHashKey}>Get Current Hash Key</button>
      <p>
        Current Hash Key:
        {currentHashKey}
      </p>
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
}

export default Popup;
