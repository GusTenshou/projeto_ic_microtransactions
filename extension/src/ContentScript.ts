window.addEventListener('message', (event) => {
    if (event.data.type === "RequestDataStorage") {
        chrome.runtime.sendMessage({ action: "getData" }, (response) => {
            if (response !== undefined) {
                window.postMessage({ type: "ExtensionData", data: response.data }, "*");
            }
        });
    }
});
