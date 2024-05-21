import createHashChain from "./hashMaker.ts";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "makeHashChain") {
    const { secret, length }: { secret: string; length: number } = message.data;
    addHash(createHashChain(secret, length));
    console.log("Hash criado");
  } else if (message.action === "Deliver_h(100)") {
    chrome.storage.local.get({ hashChain: [] }, (result) => {
      const hashChain = result.hashChain || [];
      if (hashChain.length > 0) {
        sendResponse({ data: hashChain[hashChain.length - 1] });
      } else {
        sendResponse({
          data: "Nao há mais dados ou não há dados armazenados.",
        });
      }
    });
    return true;
  } else if (message.action === "DeliverHashchain") {
    chrome.storage.local.get({ hashChain: [] }, (result) => {
      const hashChain = result.hashChain || [];
      console.log("Fetched hash chain for transmission:", hashChain);
      if (hashChain.length > 0) {
        const hash = hashChain.pop();
        const lastIndex = hashChain.length;
        console.log("Transmissao iniciada", hash);
        chrome.storage.local.set({ hashChain: hashChain }, () => {
          sendResponse({ data: hash, index: lastIndex });
        });
      } else {
        console.log("Deu problema");
        sendResponse({
          data: "Nao há mais hashs ou não há hashs armazenados.",
        });
      }
    });
    return true;
  }
});

function addHash(newData: `0x${string}`[]) {
  // Diretamente substitui o vetor no storage sem verificar o valor anterior
  chrome.storage.local.set({ hashChain: newData }, () => {
    console.log("Hash chain salva com sucesso!");
  });
}
