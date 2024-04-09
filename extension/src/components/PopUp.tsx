// src/Popup.tsx

import React, { useState } from 'react';

const Popup = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue) {
      chrome.runtime.sendMessage({ action: 'saveData', data: inputValue }, (response) => {
        console.log('Resposta do background:', response);
        setInputValue("");
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default Popup;
