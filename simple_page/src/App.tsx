import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [hashChainElements, setHashChainElements] = useState<string[]>([]);
  const [h100, setH100] = useState<string>("");

  const [sendHashChainAutomatically, setSendHashChainAutomatically] =
    useState(false);

  // Handling messages from the extension
  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      switch (event.data.type) {
        case "HashChain":
          setHashChainElements((prev) => [...prev, event.data.data]);
          break;
        case "Recover_h(100)":
          setH100(event.data.data);
          break;
      }
    };

    window.addEventListener("message", handleResponse);
    return () => window.removeEventListener("message", handleResponse);
  }, []);

  // Handling automatic data requests

  useEffect(() => {
    let hashChainIntervalId: number | undefined;
    if (sendHashChainAutomatically) {
      hashChainIntervalId = setInterval(
        () => window.postMessage({ type: "RequestHashChain" }, "*"),
        10000
      );
      return () => clearInterval(hashChainIntervalId);
    }
  }, [sendHashChainAutomatically]);

  const sendH100Once = () => window.postMessage({ type: "Send_h(100)" }, "*");

  return (
    <div>
      <button
        onClick={() =>
          setSendHashChainAutomatically(!sendHashChainAutomatically)
        }
      >
        {sendHashChainAutomatically ? "Parar Hash Chain" : "Iniciar Hash Chain"}
      </button>
      <button onClick={sendH100Once}>Enviar H100 Uma Vez</button>
      <ul>
        {hashChainElements.map((data, index) => (
          <li key={index}>{data}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
