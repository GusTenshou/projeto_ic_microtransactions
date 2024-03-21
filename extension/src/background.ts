chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "saveData") {
    chrome.storage.local.set({ userData: message.data }, () => {
      console.log("Dados salvos.");
      sendResponse({ status: "Dados salvos com sucesso!" });
    });
    return true;
  } else if (message.action === "getData") {
    chrome.storage.local.get(["userData"], (result) => {
      if (result.userData !== undefined) {
        sendResponse({ data: result.userData });
      } else {
        sendResponse({ data: "Don't have any data in the storage" });
      }
    });
    return true;
  }
});
