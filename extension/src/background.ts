import createHashChain from "./hashMaker.ts";
let indexHash = 1;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "makeHashChain") {
    const { secret, length } = message.data;
    addHash(createHashChain(secret, length));
  } else if (message.action === "Deliver_h(100)") {
    chrome.storage.local.get({ hashChain: [] }, (result) => {
      const hashChain = result.hashChain || [];
      if (hashChain.length > 0) {
        sendResponse({ data: hashChain[hashChain.length - 1] });
      } else {
        sendResponse({
          data: "Não há mais dados ou não há dados armazenados.",
        });
      }
    });
  } else if (message.action === "DeliverHashchain") {
    chrome.storage.local.get({ hashChain: [] }, (result) => {
      const hashChain = result.hashChain || [];
      if (hashChain.length > 0 && indexHash < hashChain.length) {
        sendResponse({ data: hashChain[indexHash] });
        indexHash++;
      } else {
        sendResponse({
          data: "Não há mais dados ou não há dados armazenados.",
        });
        indexHash = 1; // Resetar o índice para começar de novo quando necessário
      }
    });
  }
});

function addHash(newData: `0x${string}`[]) {
  // Diretamente substitui o vetor no storage sem verificar o valor anterior
  chrome.storage.local.set({ hashChain: newData }, () => {
    console.log("Hash chain salva com sucesso!");
  });
}
