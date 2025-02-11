"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// Импорт стилей для wallet-adapter
import "@solana/wallet-adapter-react-ui/styles.css";
import "./styles/walletAdapterOverrides.css";

function AppContent() {
  // Извлекаем объект кошелька и connection из контекста
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;
  const { connection } = useConnection();

  // Состояния для операций (перевода SOL, создания pNFT и получения информации о токене)
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [mintInput, setMintInput] = useState("");
  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenMetadataPda, setTokenMetadataPda] = useState(null);

  // Функция для вычисления PDA метаданных
  function getMetadataPda(mint) {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );
    return pda;
  }

  // Функция для вычисления PDA мастер-издания
  function findMasterEditionPda(mint) {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
      TOKEN_METADATA_PROGRAM_ID
    );
    return pda;
  }

  // Функция для получения данных цифрового актива
  async function fetchDigitalAsset(umi, mint) {
    try {
      const metadataPda = getMetadataPda(mint);
      const accountInfo = await umi.connection.getAccountInfo(metadataPda);
      return accountInfo;
        } catch (error) {
      return null;
    }
  }

  // Функция для перевода SOL
  const onTransferSol = async () => {
    if (!publicKey || !signTransaction) {
      alert("Пожалуйста, подключите кошелек!");
            return;
        }
    try {
      setLoadingTransfer(true);
      const RECIPIENT_ADDRESS = new PublicKey("3HE6EtGGxMRBuqqhz2gSs3TDRXebSc8HDDikZd1FYyJj");
      const TRANSFER_AMOUNT = 0.001 * LAMPORTS_PER_SOL; // 0.001 SOL в лампортах

      // Создаем инструкцию для трансфера SOL
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: RECIPIENT_ADDRESS,
        lamports: TRANSFER_AMOUNT,
      });

      // Собираем транзакцию
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // Подписываем и отправляем транзакцию
      const signedTx = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction ID:", txid);
      alert("Транзакция отправлена. TXID: " + txid);
        } catch (error) {
      console.error("Ошибка при отправке SOL:", error);
      alert(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
      setLoadingTransfer(false);
    }
  };

  // Функция для создания pNFT
  const onCreatePNFT = async () => {
    if (!publicKey) {
      alert("Пожалуйста, подключите кошелек!");
        return; 
    }	
    try {
      setLoadingCreate(true);

      // Инициализируем Metaplex с подключенным кошельком
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

      // Создаем программируемый NFT (pNFT)
      const { nft } = await metaplex.nfts().create({
        uri: "https://arweave.net/123", // Замените на реальный URI с метаданными
        name: "My Programmable NFT",
        sellerFeeBasisPoints: 500, // 5% роялти
        symbol: "PNFT",
        creators: [
          {
            address: publicKey,
            share: 100,
          },
        ],
        isMutable: true,
        tokenStandard: 4, // TokenStandard.ProgrammableNonFungible
        ruleSet: null,
      });

      const mintAddress = nft.address.toString();
      console.log("Created pNFT:", {
        mintAddress,
        name: nft.name,
        symbol: nft.symbol,
        uri: nft.uri,
      });
      alert(`pNFT создан успешно! Mint address: ${mintAddress}`);
        } catch (error) {
      console.error("Ошибка при создании pNFT:", error);
      alert(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
      setLoadingCreate(false);
    }
  };

  // Функция для получения информации о токене
  const getTokenInfo = async () => {
    if (!mintInput) {
      alert("Введите адрес mint!");
    return;
}
    try {
      setLoadingToken(true);

      // Создаем UMI instance на devnet
      const umi = await createUmi("https://api.devnet.solana.com");

      // Преобразуем строку mint в PublicKey
      const mintPk = new PublicKey(mintInput);

      // Вычисляем PDA для метаданных
      const pda = getMetadataPda(mintPk);
      setTokenMetadataPda(pda.toString());

      // Вычисляем PDA для master edition (если применимо)
      let masterEditionPda;
      try {
        masterEditionPda = findMasterEditionPda(mintPk);
    } catch (error) {
        masterEditionPda = null;
      }

      // Пытаемся получить данные цифрового актива
      let asset;
      try {
        asset = await fetchDigitalAsset(umi, mintPk);
        } catch (error) {
        asset = null;
      }

      // Формируем сообщение для вывода
      let message = `Информация о токене:
Mint: ${mintInput}
Metadata PDA: ${pda.toString()}
Master Edition PDA: ${masterEditionPda ? masterEditionPda.toString() : "не найден"}
`;
      if (asset) {
        message += `Детали цифрового актива: ${JSON.stringify(asset, null, 2)}`;
    } else {
        message += `Данных цифрового актива не получено.`;
      }
      console.log("Информация о токене:");
      console.log(message);
      alert(message);
        } catch (error) {
      console.error("Ошибка:", error);
      alert(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingToken(false);
    }
  };

useEffect(() => {
    // Инициализируем metadata PDA для тестового mint-адреса (замените значение по необходимости)
    try {
      const defaultMint = new PublicKey("YOUR_NFT_MINT_ADDRESS");
      const pda = getMetadataPda(defaultMint);
      setTokenMetadataPda(pda.toString());
            } catch (error) {
      console.error("Ошибка при вычислении PDA, проверьте mint-адрес:", error);
    }
    }, []);	

    return (
    <main className="min-h-screen p-3">
      <div className="mb-5">
        <WalletMultiButton className="rounded-none bg-purple-700 text-white shadow-xl" />
            </div>
      {publicKey && (
        <>
          <div className="flex flex-col gap-4 mb-5">
                <button
              onClick={onTransferSol}
              disabled={loadingTransfer}
              className="mt-5 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loadingTransfer ? "Processing..." : "Send 0.001 SOL"}
                </button>
					      <button
              onClick={onCreatePNFT}
              disabled={loadingCreate}
              className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-400"
            >
              {loadingCreate ? "Creating pNFT..." : "Create pNFT"}
      </button>
          </div>
          <div className="mb-5">
                        <input
                            type="text"
              placeholder="Введите адрес mint"
              value={mintInput}
              onChange={(e) => setMintInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 mb-4 w-full text-black"
                        />
                        <button
              onClick={getTokenInfo}
              disabled={loadingToken}
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400"
            >
              {loadingToken ? "Processing..." : "Получить информацию"}
                        </button>
            {tokenMetadataPda && <p className="mt-4">Metadata PDA: {tokenMetadataPda}</p>}
                    </div>
                </>
            )}
    </main>
  );
}

export default function App() {
  // Конфигурация для wallet-adapter
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
