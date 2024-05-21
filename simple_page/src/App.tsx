import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [hashChainElements, setHashChainElements] = useState<
    { data: string; index: number }[]
  >([]);
  const [h100, setH100] = useState<string>("");

  const [sendHashChainAutomatically, setSendHashChainAutomatically] =
    useState(false);

  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      if (event.data.type === "HashChain") {
        setHashChainElements((prev) => [
          ...prev,
          { data: event.data.data, index: event.data.index },
        ]);
      } else if (event.data.type === "Recover_h(100)") {
        setH100(event.data.data);
      }
    };

    window.addEventListener("message", handleResponse);
    return () => window.removeEventListener("message", handleResponse);
  }, []);

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
        {hashChainElements.map((element, index) => (
          <li key={index}>
            {element.index}: {element.data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
