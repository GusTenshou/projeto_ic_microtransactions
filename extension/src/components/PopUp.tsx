import React, { useState } from "react";

const Popup = () => {
  const [inputSecret, setInputSecret] = useState("");
  const [inputLength, setInputLength] = useState<number | "">(""); // Allows starting as an empty string and accepting numbers
  const [hashChain, setHashChain] = useState<string[]>([]);

  const handleInputSecret = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSecret(event.target.value);
  };

  const handleInputLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(event.target.value === "" ? "" : Number(event.target.value)); // Converts input to a number
  };

  const handleHashSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputSecret && inputLength) {
      chrome.runtime.sendMessage(
        {
          action: "makeHashChain",
          data: { secret: inputSecret, length: inputLength },
        },
        (response) => {
          console.log("Resposta do background:", response);
          setInputSecret("");
          setInputLength(""); // Clear the field after sending
        }
      );
    }
  };

  const fetchHashChain = () => {
    chrome.storage.local.get("hashChain", (result) => {
      if (result.hashChain) {
        setHashChain(result.hashChain);
      } else {
        console.log("No hash chain available or error in fetching.");
        setHashChain([]); // Optional: Clear previous hash chain if any
      }
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
        <button type="submit">Gerar Hash</button>
      </form>
      <button onClick={fetchHashChain}>Exibir Hash Chain</button>
      <ul>
        {hashChain.map((hash, index) => (
          <li key={index}>{hash}</li>
        ))}
      </ul>
    </div>
  );
};

export default Popup;
