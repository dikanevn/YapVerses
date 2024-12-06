import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Подключаем ethers

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState(0);
  const [account, setAccount] = useState(null);  // Для хранения адреса аккаунта
  const [balance, setBalance] = useState(0);     // Для хранения баланса

  const handleSum = () => {
    setSum(num1 + num2);
  };

  // Функция для подключения к MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: 'eth_requestAccounts',  // Запрашиваем подключение
        });
        setAccount(selectedAccount);  // Устанавливаем адрес аккаунта
        getBalance(selectedAccount);  // Получаем баланс
      } catch (error) {
        console.log('Error connecting to MetaMask', error);
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  // Функция для получения баланса
  const getBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account); // Получаем баланс в wei
    setBalance(ethers.utils.formatEther(balance)); // Преобразуем в ether и устанавливаем
  };

  // Автоматическое подключение при загрузке
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);  // Обновляем аккаунт при смене
        getBalance(accounts[0]);  // Обновляем баланс
      });
    }
  }, []);

  return (
    <div>
      <h1>Сложение чисел</h1>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
          placeholder="Число 1"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
          placeholder="Число 2"
        />
        <button onClick={handleSum}>Посчитать</button>
      </div>
      <h2>Результат: {sum}</h2>

      {/* Кнопка для подключения MetaMask */}
      <button onClick={connectWallet}>
        {account ? `Подключен: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Подключить MetaMask'}
      </button>

      {/* Если аккаунт подключен, показываем баланс */}
      {account && (
        <div>
          <h3>Баланс: {balance} ETH</h3>
        </div>
      )}
    </div>
  );
}

export default App;
