import createHashChain from "./hashMaker.ts";

let hash_key = "";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "makeHashChain") {
    const {
      secret,
      length,
      key,
    }: { secret: string; length: number; key: string } = message.data;

    const start_chain: string[] = createHashChain(secret, length);
    const hashChainData: HashObject = {
      address_contract: "",
      address_to: "",
      length: length,
      hashchain: start_chain,
      isValid: false,
      key: key,
    };
    addHash(hashChainData, key, sendResponse);
    console.log("Hash created and stored");
  } else if (message.action === "Deliver_h(100)") {
    const key: string = message.data;
    chrome.storage.local.get({ hashChains: [] }, (result) => {
      const hashChains: HashObject[] = result.hashChains;
      const hashObject = hashChains.find((obj) => obj.key === key);
      const hashChain = hashObject ? hashObject.hashchain : [];
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
    chrome.storage.local.get({ hashChains: [] }, (result) => {
      const hashChains: HashObject[] = result.hashChains;
      const hashObjectIndex = hashChains.findIndex(
        (obj) => obj.key === hash_key
      );

      const hashObject = hashChains[hashObjectIndex];
      console.log(hashObject);

      if (hashObject && hashObject.hashchain.length > 0) {
        const hash = hashObject.hashchain.pop();
        const lastIndex = hashObject.hashchain.length;
        console.log("Transmission started", hash);

        // Update the hashObject in the hashChains array
        hashChains[hashObjectIndex] = hashObject;

        chrome.storage.local.set({ hashChains: hashChains }, () => {
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
  } else if (message.action === "changeHashChain") {
    const { key } = message.data; // Ensure key is extracted correctly
    hash_key = key;
    console.log("Hash key updated to:", hash_key); // Add logging statement
    sendResponse({ data: "hash selected" });
  } else if (message.action === "getHashKey") {
    sendResponse({ data: hash_key });
  }
});

function addHash(
  newHashObject: HashObject,
  key: string,
  sendResponse: (response: any) => void
) {
  chrome.storage.local.get({ hashChains: [] }, (result) => {
    const hashChains: HashObject[] = result.hashChains;
    hashChains.push(newHashObject);
    chrome.storage.local.set({ hashChains: hashChains }, () => {
      console.log("Hash chain saved successfully!");
      sendResponse({ status: "success", key });
    });
  });
}

interface HashObject {
  address_contract: string;
  address_to: string;
  length: number;
  hashchain: string[];
  isValid: boolean;
  key: string;
}
