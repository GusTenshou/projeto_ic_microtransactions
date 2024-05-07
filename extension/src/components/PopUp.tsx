import React, { useState } from "react";

const Popup = () => {
  const [inputSecret, setInputSecret] = useState("");
  const [inputLength, setInputLength] = useState<number | "">(""); // Permite começar como string vazia e aceitar números

  const handleInputSecret = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSecret(event.target.value);
  };

  const handleInputLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(event.target.value === "" ? "" : Number(event.target.value)); // Converte a entrada para número
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
          setInputLength(""); // Limpa o campo após enviar
        }
      );
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleHashSubmit}>
          <input
            type="text"
            value={inputSecret}
            onChange={handleInputSecret}
            placeholder="Digite o segredo"
          />
          <input
            type="number" // Define o tipo como number
            value={inputLength}
            onChange={handleInputLength}
            placeholder="Digite o comprimento"
            min="1" // Define um valor mínimo
          />
          <button type="submit">Gerar Hash</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
