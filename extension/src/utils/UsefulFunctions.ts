import { keccak256 } from "viem";
import { HashObject } from "../utils/interfaces.ts";

function toHex(str: string): `0x${string}` {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}

function createHashChain(secret: string, length: number): `0x${string}`[] {
  let currentHash: `0x${string}` = keccak256(toHex(secret));
  const hashChain = [currentHash];

  for (let i = 1; i < length; i++) {
    currentHash = keccak256(`0x${currentHash.slice(2)}`);
    hashChain.push(currentHash);
  }

  return hashChain;
}

function addHash(
  newHashObject: HashObject,
  key: string,
  sendResponse: (response: any) => void
) {
  chrome.storage.local.get({ hashChains: [] }, (result) => {
    let hashChains: HashObject[] = result.hashChains;

    // Find the index of the existing hash object with the same key
    const existingIndex = hashChains.findIndex((obj) => obj.key === key);

    if (existingIndex !== -1) {
      // Replace the existing hash object
      hashChains[existingIndex] = newHashObject;
      console.log(`Hash chain with key ${key} replaced successfully!`);
    } else {
      // Add the new hash object
      hashChains.push(newHashObject);
      console.log(`New hash chain with key ${key} added successfully!`);
    }

    // Save the updated hashChains array to local storage
    chrome.storage.local.set({ hashChains: hashChains }, () => {
      console.log("Hash chains saved successfully!");
      sendResponse({ status: "success", key });
    });
  });
}

export { createHashChain, addHash };
