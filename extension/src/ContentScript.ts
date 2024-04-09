window.addEventListener('message', (event) => {
    if (event.data.type === "RequestDataStorage") {
        chrome.runtime.sendMessage({action: "getData"}, (response) => {
            // Verifica se a resposta não é undefined antes de tentar acessar suas propriedades
            if (response !== undefined) {
                window.postMessage({ type: "ExtensionData", data: response.data }, "*");
                console.log("Enviou à paǵina web");
            } else {
                // Se response for undefined, talvez você queira tratar esse caso de forma diferente
                window.postMessage({ type: "ExtensionData", data: "No data found" }, "*");
            }
            console.log("Recebeu requisição e enviou ao background");
        });
    }
});
