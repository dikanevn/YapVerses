import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleGridABI from './SimpleGridABI.json'; // Ваш ABI контракта
import './App.css';

const App = () => {
  // Состояния для MetaMask и контракта
  const [account, setAccount] = useState(null);  // Адрес аккаунта
  const [balance, setBalance] = useState(0);     // Баланс
  const [provider, setProvider] = useState(null); // Провайдер для контракта
  const [contract, setContract] = useState(null); // Контракт
  const [grid, setGrid] = useState([]);           // Данные сетки
  const [loading, setLoading] = useState(false);  // Статус загрузки

  const contractAddress = "0x56f6bB37cB1Cb27d653e436DCCdE222cE4656FdA";  // Замените на адрес контракта

  // Функция для подключения к MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(selectedAccount);  // Устанавливаем адрес аккаунта
        getBalance(selectedAccount);  // Получаем баланс
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const signer = prov.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, SimpleGridABI, signer);
        setProvider(prov);  // Сохраняем провайдер
        setContract(contractInstance);  // Сохраняем контракт
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
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance)); // Преобразуем в ether и устанавливаем
  };

  // Функция для получения данных сетки
  const fetchGrid = async () => {
    setLoading(true);
    const tempGrid = [];
    if (contract) {
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const cell = await contract.getCell(x, y);
          tempGrid.push({ x, y, content: cell });
        }
      }
      setGrid(tempGrid);
    }
    setLoading(false);
  };

  // Функция для размещения "ора"
  const placeOre = async (x, y) => {
    if (contract) {
      try {
        await contract.placeOre(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения:", error);
      }
    }
  };

  // Автоматическое подключение при загрузке
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      });
    }
  }, []);

  return (
    <div>
      <h1>Simple Grid DApp</h1>

      {/* Подключение MetaMask */}
      <button onClick={connectWallet}>
        {account ? `Подключен: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Подключить MetaMask'}
      </button>

      {/* Баланс MetaMask */}
      {account && (
        <div>
          <h3>Баланс: {balance} ETH</h3>
        </div>
      )}

      {/* Взаимодействие с контрактом */}
      {provider && (
        <div>
          <button onClick={fetchGrid} disabled={loading}>
            {loading ? "Загрузка..." : "Показать сетку"}
          </button>
          <div>
            {grid.map((cell, index) => (
              <div key={index}>
                <p>Ячейка ({cell.x}, {cell.y}): {cell.content}</p>
                {cell.content === "Empty" && (
                  <button onClick={() => placeOre(cell.x, cell.y)}>
                    Разместить Ор
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
