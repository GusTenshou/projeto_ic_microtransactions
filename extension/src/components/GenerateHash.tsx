import React, { useState } from "react";

const GenerateHash = () => {
  const [inputSecret, setInputSecret] = useState("");
  const [inputLength, setInputLength] = useState<number | "">("");
  const [inputKey, setInputKey] = useState("");

  const handleInputSecret = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSecret(event.target.value);
  };

  const handleInputLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleInputKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(event.target.value);
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

  return (
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
        min="1"
      />
      <input
        type="text"
        value={inputKey}
        onChange={handleInputKey}
        placeholder="Digite a chave"
      />
      <button type="submit">Create hash chain</button>
    </form>
  );
};

export default GenerateHash;
