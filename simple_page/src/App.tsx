import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  // Define um estado para armazenar os dados recebidos da extensão
  const [dataFromExtension, setDataFromExtension] = useState<string | null>(null);

  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      if (event.data.type === "ExtensionData") {
        console.log("Dados recebidos da extensão:", event.data.data);
        setDataFromExtension(event.data.data);
      }
    };

    window.addEventListener('message', handleResponse);

    // Remove o event listener ao desmontar o componente
    return () => {
      window.removeEventListener('message', handleResponse);
    };
  }, []);

  const requestData = () => {
    window.postMessage({ type: "RequestDataStorage" }, "*");
  };

  return (
    <div>
      <h1>Página de Comunicação com a Extensão</h1>
      <button onClick={requestData}>Pedir Dados para a Extensão</button>
      {/* Exibe os dados recebidos na tela */}
      {dataFromExtension ? <p>Dados Recebidos: {dataFromExtension}</p> : <p>Nenhum dado recebido ainda.</p>}
    </div>
  );
};

export default App;
