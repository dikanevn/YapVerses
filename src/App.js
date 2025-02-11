import React, { useState } from 'react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection, PublicKey } from '@solana/web3.js';

function App() {
  // Состояние для сохранения адреса кошелька после подключения
  const [walletAddress, setWalletAddress] = useState(null);

  // Функция подключения кошелька Phantom
  const connectWallet = async () => {
    if (window?.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());
      } catch (err) {
        console.error('Ошибка подключения:', err);
      }
    } else {
      alert("Phantom wallet не найден. Пожалуйста, установите Phantom.");
    }
  };

  // Функция отключения кошелька Phantom
  const disconnectWallet = async () => {
    if (window?.solana && window.solana.isPhantom) {
      try {
        await window.solana.disconnect();
        setWalletAddress(null);
      } catch (err) {
        console.error('Ошибка при отключении кошелька:', err);
      }
    }
  };

  // Функция перевода 0.001 SOL на заданный адрес
  const transferSol = async () => {
    if (!walletAddress) {
      alert("Подключите кошелек для совершения транзакции.");
      return;
    }
    try {
      // Создаем соединение с devnet
      const connection = new Connection("https://api.devnet.solana.com");
      // Адрес получателя
      const recipient = new PublicKey("3HE6EtGGxMRBuqqhz2gSs3TDRXebSc8HDDikZd1FYyJj");
      // Формируем транзакцию
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: window.solana.publicKey,
          toPubkey: recipient,
          lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL в лампортах
        })
      );

      transaction.feePayer = window.solana.publicKey;
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Подписываем транзакцию
      const signedTransaction = await window.solana.signTransaction(transaction);
      // Отправляем транзакцию в сеть
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      alert("Транзакция отправлена. TXID: " + signature);
    } catch (err) {
      console.error("Ошибка при трансфере SOL:", err);
      alert("Ошибка при трансфере SOL");
    }
  };

  return (
    <div style={{
      backgroundColor: 'black',
      height: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Hello World</h1>
      {walletAddress ? (
        <>
          <p>Подключено: {walletAddress}</p>
          <button 
            onClick={transferSol}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '5px',
              border: 'none',
              marginTop: '10px'
            }}
          >
            Перевести 0.001 SOL
          </button>
          <button 
            onClick={disconnectWallet} 
            style={{
              padding: '10px 20px', 
              fontSize: '16px', 
              cursor: 'pointer',
              borderRadius: '5px',
              border: 'none',
              marginTop: '10px'
            }}
          >
            Отключить Phantom Wallet
          </button>
        </>
      ) : (
        <button 
          onClick={connectWallet} 
          style={{
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none'
          }}
        >
          Подключить Phantom Wallet
        </button>
      )}
    </div>
  );
}

export default App;
