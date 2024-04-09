import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [dataFromExtension, setDataFromExtension] = useState<string[]>([]);
  const [shouldSendAutomatically, setShouldSendAutomatically] = useState(false);

  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      if (event.data.type === "ExtensionData") {
        console.log("Dados recebidos da extensão:", event.data.data);
        setDataFromExtension(prevData => [...prevData, event.data.data]);
      }
    };

    window.addEventListener('message', handleResponse);

    let intervalId: ReturnType<typeof setInterval>;
    if (shouldSendAutomatically) {
      intervalId = setInterval(() => {
        window.postMessage({ type: "RequestDataStorage" }, "*");
      }, 10000); // 10000 milissegundos = 10 segundos
    }

    return () => {
      window.removeEventListener('message', handleResponse);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [shouldSendAutomatically]);

  const startSendingData = () => {
    if (!shouldSendAutomatically) {
      setShouldSendAutomatically(true);
      window.postMessage({ type: "RequestDataStorage" }, "*");
    }
  };

  return (
    <div>
      <h1>Página de Comunicação com a Extensão</h1>
      <button onClick={startSendingData}>Iniciar Pedido de Dados</button>
      {dataFromExtension.length > 0 ? (
        <ul>
          {dataFromExtension.map((data, index) => (
            <li key={index}>Dados Recebidos: {data}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum dado recebido ainda.</p>
      )}
    </div>
  );
};

export default App;
