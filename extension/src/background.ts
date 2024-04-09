let index = 0; // Mantém o índice do próximo item a ser enviado

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "saveData") {
    addData(message.data);
    console.log("Dados salvos.");
    sendResponse({ status: "Dados salvos com sucesso!" });
    // Não é necessário retornar true aqui, a menos que você esteja enviando a resposta de forma assíncrona após o callback
  } else if (message.action === "getData") {
    chrome.storage.local.get({ dados: [] }, (result) => {
      if (result.dados.length > 0 && index < result.dados.length) {
        sendResponse({ data: result.dados[index] });
        console.log("Enviou:", result.dados[index]);
        index++; // Move para o próximo item
      } else {
        sendResponse({ data: "Não há mais dados ou não há dados armazenados." });
        index = 0; // Reinicia o índice se chegou ao fim do array ou não há dados
      }
    });
    return true; // Indica que a resposta será enviada de forma assíncrona.
  }
});

function addData(newData: any) {
  chrome.storage.local.get({ dados: [] }, (result) => {
    const updatedDados = [...result.dados, newData];
    chrome.storage.local.set({ dados: updatedDados }, () => {
      console.log("Dados salvos!");
    });
  });
}
