
		
		


import { Wallet } from "ethers";

import React, {
	useState,
	useEffect,
	useRef
}
from 'react';
import './App.css';
import {
	ethers
}
from 'ethers';
import SimpleGridAbiCCC from './SimpleGridAbiCCC.json';
import SimpleGridAbiBBB from './SimpleGridAbiBBB.json';
import SimpleGridAbiAAA from './SimpleGridAbiAAA.json';
import SimpleGridAbiMAIN from './SimpleGridAbiMAIN.json';

document.body.style.backgroundColor = "#000";
document.body.style.color = "#000";


function saveToFile(data, filename) {
    // Convert data to JSON string
    const jsonData = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the DOM
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}	


const App = () => {
	
	

	
	
	
	
	
	
		let transactionQueue = []; // Очередь транзакций
let isProcessing = false; // Флаг обработки очереди
let isNonceInitializing = false;
		
		
		
const [currentNonce, setCurrentNonce] = useState(null);


		const contractAddressMain = "0x70B613765AE92fd1D3BF12Af216671b04203712A";
		
		
		
		const contractAddressAAA = "0x2F9b4BF7eB898C8aF1CaAf13a3DBfaeB65BC26cD";
		const contractAddressBBB = "0xb8C585fD2b4Eb15D302dED205C19CFCD08C53D51";
		
		const contractAddressCCC = "0xA1B0Df7606fC58FedD7fc5c9b4E437eD98c5728b";

		
		const [grid, setGrid] = useState([]);
		const [depot, setDepot] = useState([]);
		const [loading, setLoading] = useState(false);
		const [action, setAction] = useState("getCell");
		const [selectedCell, setSelectedCell] = useState(null);
		const [selectedCell2, setSelectedCell2] = useState(null);
		const [logMessages, setLogMessages] = useState([]);
		const [activeCells, setActiveCells] = useState([]);
		const [isPressed, setIsPressed] = useState(false);
		const defaultPrivateKey = ""; // Ваш тестовый приватный ключ
		const [userPrivateKey, setUserPrivateKey] = useState(defaultPrivateKey);
		const [isKeyConfirmed, setIsKeyConfirmed] = useState(!!defaultPrivateKey); // Подтверждаем, только если ключ непустой
		const [isUsingPrivateKey, setIsUsingPrivateKey] = useState(true);
		const [privateSigner, setPrivateSigner] = useState(null);
		const [signer, setSigner] = useState(null);
		const [timePassed, setTimePassed] = useState('');
		const [Distance, setDistance] = useState('');
		const updateCoalButtonRef = useRef(null);
const [isGamePaused, setIsGamePaused] = useState(0); // 1 - пауза, 0 - игра идёт
const buttonActionRef = useRef(false);
const [earlyValue, setEarlyValue] = useState(0); // Для отображения переменной early
const [speedkoefState, setSpeedkoefState] = useState(0); // Для отображения переменной early
const [mmmtimeValue, setMmmtimeValue] = useState(0); // Для отображения переменной mmmtime
const [meteoritCount, setMeteoritCount] = useState(0); // Для отображения количества метеоритов
const [hasGameOverAlertShown, setHasGameOverAlertShown] = useState(false);
const [hasEarlyAlertShown, setHasEarlyAlertShown] = useState(false);
const [trainingCompletedState, setTrainingCompletedState] = useState(1); // Новый параметр: 0 - обучение не завершено, 1 - завершено
const [meteoriteFrequency, setMeteoriteFrequency] = useState(0); // Частота метеоритов
const [isToggled, setIsToggled] = useState(true);
const [logMessage, setLogMessage] = useState(""); // Состояние для хранения лог-сообщения
const [logBigErrorMessage, setlogBigErrorMessage] = useState(""); // Состояние для хранения лог-сообщения
const [raznica, setRaznica] = useState(false);
const [gotoGameLevel, setGotoGameLevel] = useState(200); // Инициализация состояния для gotoLevel
		const [playerstat, setPlayerstat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topPlayers, setTopPlayers] = useState([]);		
    const [isChronicleOpen, setIsChronicleOpen] = useState(false);
    const [contractsChain, setContractsChain] = useState([]);
const [allChronicles, setAllChronicles] = useState([]);
    const [isSchoolOpen, setIsSchoolOpen] = useState(true);
const [pendingRecord, setPendingRecord] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");		
  const [hasPendingPopupBeenShown, setHasPendingPopupBeenShown] = useState(false);
		
		useEffect(() => {
			// Очистка состояния при обновлении страницы
			setGrid([]);
			setDepot([]);
			setAction(null);
			setSelectedCell(null);
		}, []); 
	

	

const getSigner = () => {
    if (!privateSigner) {
        throw new Error("Приватный ключ не установлен или не подтверждён.");
    }
    return privateSigner;
};

		
		
const [provider, setProvider] = useState(null);

useEffect(() => {
    const initializeProvider = async () => {
        try {
            const rpcUrl = "https://pacific-rpc.sepolia-testnet.manta.network/http";
            const newProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
            setProvider(newProvider);
            console.log("Провайдер инициализирован через JSON-RPC.");
        } catch (error) {
            console.error("Ошибка при инициализации провайдера:", error);
        }
    };

    initializeProvider();
}, []);
		
		

		
		
		
		
		
		
		
		
		

		const logContainerRef = useRef(null);
		useEffect(() => {
			if (logContainerRef.current) {
				logContainerRef.current.scrollTo(0, 0);
			}
		}, [logMessages]);
		const providerRef = useRef(null);
		
		

		
		
		
		const initializeEmptyGrid = (rows, cols) => {
			return Array(rows).fill(null).map((_, rowIndex) => Array(cols).fill(null).map((_, colIndex) => ({
				x: rowIndex,
				y: colIndex,
				content: "Update",
				tool: "Update",
				man: "manEmpty",
				coalAmount: "0",
				ironAmount: "0",
				ironplateAmount: "0",
				lastBlockChecked: "0",
				componentsAmount: "0",
				factorySettings: "factorySettingsEmptyF",
				previouscontent: "contentEmpty",
				wallPowerAmount: "0",
			})));
		};
		
		
		
		useEffect(() => {
			const emptyGrid = initializeEmptyGrid(10, 10); // Создаем пустой грид 10x10
			setGrid(emptyGrid); // Устанавливаем его в состояние
		}, []);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
const fetchGrid = async () => {
    try {
        if (!provider) {
            return;
        }
        if (isFetching.current) {
            return;
        }
        isFetching.current = true;

        let signerInstance;
        if (userPrivateKey) {
            signerInstance = new ethers.Wallet(userPrivateKey, provider);
        } else {
            return;
        }

        let newContract;
        try {
            newContract = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, signerInstance);

            const maxParallelRequests = 20; // Максимальное количество параллельных запросов
            const minIntervalBetweenRequests = 1; // Минимальный интервал между запросами в миллисекундах
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };

            const processCell = async (x, y) => {
                try {
                    await delay(minIntervalBetweenRequests); // Интервал между запросами
                    const userAddress = await signerInstance.getAddress();
                    const result = await newContract.getCell(userAddress, x, y);

                    const cellData = result
                        ? {
                            x,
                            y,
                            content: result.content || "Null",
                            tool: result.tool || "Update",
                            man: result.man || "manEmpty",
                            coalAmount: result.coalAmount?.toString() || "0",
                            ironAmount: result.ironAmount?.toString() || "0",
                            ironplateAmount: result.ironplateAmount?.toString() || "0",
                            lastBlockChecked: result.lastBlockChecked?.toString() || "0",
                            componentsAmount: result.componentsAmount?.toString() || "0",
                            factorySettings: result.factorySettings || "",
                            previouscontent: result.previouscontent || "contentEmpty",
                            wallPowerAmount: result.wallPowerAmount?.toString() || "0",
                        }
                        : {
                            x,
                            y,
                            content: "contentEmpty",
                            tool: "Update",
                            man: "manEmpty",
                            coalAmount: "0",
                            ironAmount: "0",
                            ironplateAmount: "0",
                            lastBlockChecked: "0",
                            componentsAmount: "0",
                            factorySettings: "factorySettingsEmptyF",
                            previouscontent: "contentEmpty",
                            wallPowerAmount: "0",
                        };

                    setGrid((prevGrid) => {
                        const updatedGrid = prevGrid.length > 0 ? [...prevGrid] : initializeEmptyGrid(10, 10);
                        if (!updatedGrid[x]) {
                            updatedGrid[x] = Array(10).fill(null).map(() => ({}));
                        }
                        updatedGrid[x][y] = cellData;
                        return updatedGrid;
                    });
                } catch (error) {
                    setGrid((prevGrid) => {
                        const updatedGrid = [...prevGrid];
                        if (!updatedGrid[x]) {
                            updatedGrid[x] = Array(10).fill(null);
                        }
                        updatedGrid[x][y] = {
                            x,
                            y,
                            content: "Update",
                            tool: "Update",
                            man: "manEmpty",
                            coalAmount: "0",
                            ironAmount: "0",
                            ironplateAmount: "0",
                            lastBlockChecked: "0",
                            componentsAmount: "0",
                            factorySettings: "0",
                            previouscontent: "contentEmpty",
                            wallPowerAmount: "0",

                        };
                        return updatedGrid;
                    });
                }
            };

            // Генерация пар координат и их перемешивание
            const coordinates = [];
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    coordinates.push({ x, y });
                }
            }
            shuffleArray(coordinates);

            const tasks = coordinates.map(({ x, y }) => () => processCell(x, y));

            const executeTasks = async (tasks, maxParallel) => {
                const executing = [];
                for (const task of tasks) {
                    const p = task().finally(() => {
                        executing.splice(executing.indexOf(p), 1);
                    });
                    executing.push(p);
                    if (executing.length >= maxParallel) {
                        await Promise.race(executing);
                    }
                }
                await Promise.all(executing);
            };

            await executeTasks(tasks, maxParallelRequests);

            setLoading(true);

            signerInstance = new ethers.Wallet(userPrivateKey, provider);
            const userAddress = await signerInstance.getAddress();
            const result = await newContract.getDepot(userAddress);
			
            const gridSize = result.gridSize.toString();
            const drillsAmount = result.drillsAmount.toString();
            const boxesAmount = result.boxesAmount.toString();
            const mansAmount = result.mansAmount.toString();
            const furnaceAmount = result.furnaceAmount.toString();
            const factoryAmount = result.factoryAmount.toString();
            const starttimee = result.starttimee.toString();
            const lastmeteoritTimeChecked = result.lastmeteoritTimeChecked.toString();
            const blocktimestamp = result.blocktimestamp.toString();
            const bulldozerAmount = result.bulldozerAmount.toString();
            const early = result.early.toString();
            const mmmtime = result.mmmtime.toString();
            const mmmdrillSpeed = result.mmmdrillSpeed.toString();
            const iterationLimitDepot = result.iterationLimitDepot.toString();
            const isPaused = result.isPaused.toString();
            const pausedDuration = result.pausedDuration.toString();
            const pauseStartTime = result.pauseStartTime.toString();
            const wallAmount = result.wallAmount.toString();
            const theEndCount = result.theEndCount.toString();
            const speedkoef = result.speedkoef.toString();
            const trainingCompleted = result.trainingCompleted.toString();
const normalizedTime = result.normalizedTime.toString();
const lastUpdateTime = result.lastUpdateTime.toString();
const gotoLevel = result.gotoLevel.toString();
const frequencyFactor = result.frequencyFactor.toString();

			
            setDepot({
                gridSize,
                drillsAmount,
                boxesAmount,
                mansAmount,
                furnaceAmount,
                factoryAmount,
                starttimee,
                lastmeteoritTimeChecked,
                blocktimestamp,
                bulldozerAmount,
                wallAmount,
                theEndCount,
                early,
                mmmtime,
                mmmdrillSpeed,
                iterationLimitDepot,
                isPaused,
                pausedDuration,
                pauseStartTime,
                speedkoef,
				trainingCompleted,
				normalizedTime,
				lastUpdateTime,
				frequencyFactor,
				gotoLevel,
				
            });
			
			
setSelectedSpeed(Number(speedkoef).toString() + "x");
            const currentTime = Date.now() / 1000;
            const lag = currentTime - Number(blocktimestamp);
			
setTrainingCompletedState(Number(trainingCompleted)); // Устанавливаем значение из депо
            setSpeedkoefState(Number(speedkoef));
            setEarlyValue(Number(early));
            setMmmtimeValue(Number(mmmtime));
            setMeteoritCount(Math.floor(Number(early) / Math.floor(Number(mmmtime))));
            setDynamicEarlyValue(Math.round(Number(early) + lag));
            setIsGamePaused(parseInt(isPaused));
            setGotoGameLevel(parseInt(gotoLevel));
			
			
			
const playerStatResult = await newContract.getPlayerstat(userAddress);

const playerStatsData = {
    bestScore: playerStatResult.bestScore.toString(),
    name: playerStatResult.name,
    firstGameTimestamp: playerStatResult.firstGameTimestamp.toString(),
    link: playerStatResult.link,
};

// Обновляем состояние для Playerstat
setPlayerstat(playerStatsData);
			
			
			
			
			
			
			
			
			
        } catch (error) {
        } finally {
            setLoading(false);
        }
    } catch (error) {
    } finally {
        isFetching.current = false;
    }
};





































































































useEffect(() => {
    if (!isToggled) {

        return; // Не выполнять код, если isToggled выключен
    }
    if (raznica) {
            console.log("raznica. Ожидание updateCoal..");
        return; // Не выполнять код, если raznica 
    }
    if (parseInt(depot.theEndCount, 10) <= 100) {

        return; 
    }	
    if (isGamePaused === 1) {
          
        return;
    }	
	
    const checkTimeAndSendSignal = () => {
        if (!currentNonce) { // Проверяем, инициализирован ли nonce
            console.log("Nonce не инициализирован. Ожидание...");
            return;
        }

        const currentSeconds = new Date().getSeconds(); // Получаем текущую секунду
        if (currentSeconds % 5 === 0) { // Проверяем, делится ли секунда на 5 без остатка
            if (updateCoalButtonRef.current) {
                updateCoalButtonRef.current.click(); // Имитация клика
                //console.log("updateCoal...");
            } else {
                console.error("updateCoalButtonRef.current is null");
            }
        }
    };

    const intervalId = setInterval(checkTimeAndSendSignal, 1000); // Проверяем каждую секунду

    // Очистка интервала при размонтировании компонента или выключении isToggled
    return () => clearInterval(intervalId);
}, [currentNonce, isToggled, raznica, depot.theEndCount, isGamePaused]);
	
	
	
	
const prevTheEndCountRef = useRef(null); // Инициализация useRef в теле компонента



/*
useEffect(() => {
    if (
        prevTheEndCountRef.current !== null && // Убедиться, что это не первый рендер
        prevTheEndCountRef.current > 100 && // Предыдущее значение было больше 100
        parseInt(depot.theEndCount, 10) <= 100 && // Текущее значение стало 100 или меньше
        !hasGameOverAlertShown // Убедиться, что алерт ещё не был показан
    ) {
        const timeout = setTimeout(() => {
            alert("Game Over");
            setHasGameOverAlertShown(true);
        }, 7000); // Задержка 7 секунд

        return () => clearTimeout(timeout); // Очищаем таймаут, если компонент размонтируется
    }

    // Обновляем предыдущее значение
    prevTheEndCountRef.current = parseInt(depot.theEndCount, 10);
}, [depot.theEndCount, hasGameOverAlertShown]);

*/

useEffect(() => {
    const interval = setInterval(() => {
		if (parseInt(depot.theEndCount, 10) <= 100 && parseInt(depot.theEndCount, 10) != 0) {
            setlogBigErrorMessage("ПОТРАЧЕНО");
        } else {
			if (isGamePaused === 0){
            setlogBigErrorMessage("");
			}
        }
    }, 5000); // Интервал в 5 секунд

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
}, [depot.theEndCount,isGamePaused]);




	
const [dynamicEarlyValue, setDynamicEarlyValue] = useState(0); // Состояние для увеличивающегося значения

useEffect(() => {
    // Функция обновления dynamicEarlyValue каждую секунду
    const interval = setInterval(() => {
        setDynamicEarlyValue((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // Очистка интервала при размонтировании
}, []); // Эффект запускается один раз при монтировании


// Теперь везде можно использовать dynamicEarlyValue вместо early для отображения
		const isFetching = useRef(false); // Флаг для предотвращения одновременного выполнения
		
		
useEffect(() => {
    if (!provider) {
        console.error("Провайдер не установлен. Сначала подключите кошелек.");
        return;
    }

    const fetchAndSchedule = async () => {
        if (!userPrivateKey) {
            console.error("Приватный ключ не предоставлен. Пожалуйста, введите ключ.");
            return; // Пропускаем выполнение, если нет приватного ключа
        }

        if (isFetching.current) {
            //console.log("Предыдущий вызов fetchGrid еще выполняется, пропускаем новый вызов.");
            return;
        }

        try {
            //console.log("Вызов fetchGrid...");
            await fetchGrid(); // Выполняем загрузку сетки
        } catch (error) {
            console.error("Ошибка в fetchGrid:", error);
        }
    };

    // Первый вызов сразу при загрузке
    fetchAndSchedule();

    // Устанавливаем интервал для следующих вызовов
    const intervalId = setInterval(fetchAndSchedule, 5000); // Интервал в 5 секунд

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
}, [provider, userPrivateKey]); // Зависимость также от userPrivateKey


		
		
		
		
const gasLLimit = async (contractMethod, params, contract) => {
    try {
        // Проверяем, есть ли параметры
        const estimatedGas = params.length > 0
            ? await contract.estimateGas[contractMethod](...params) // Оценка газа с параметрами
            : await contract.estimateGas[contractMethod](); // Оценка газа без параметров

        //console.log(`Оценённый лимит газа для ${contractMethod}: ${estimatedGas.toString()}`);
        return estimatedGas;
    } catch (error) {
       // console.error(`Ошибка при оценке газа для ${contractMethod}:`, error);

        // Возвращаем стандартный лимит газа в случае ошибки
        return ethers.BigNumber.from("3000000"); // 3,000,000 как дефолтный лимит
    }
	

};
		
		
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		
		
		

				
		
		

				
		
		
		
		

		
		
const [nonceInitializing, setNonceInitializing] = useState(false); // Флаг инициализации nonce
		
		
const initializeNonce = async (provider, setNonceInitializing) => {
    if (!provider) {
        console.error("Provider не инициализирован. Подключите кошелек перед отправкой транзакции.");
        return null;
    }

    try {
        console.log("Инициализация nonce...");
        setNonceInitializing(true);

        const signer = getSigner(); // Получаем privateSigner
        if (!signer) {
            console.error("Signer не установлен. Убедитесь, что приватный ключ подтвержден.");
            return null;
        }

        const userAddress = await signer.getAddress();
        const nonce = await provider.getTransactionCount(userAddress, "latest");
        console.log(`Nonce инициализирован: ${nonce}`);
			    setLogMessages((prev) => [
        { text: `Nonce инициализирован:${nonce}`, color: '#bcbf00' },
        ...prev,
    ]);
		    setLogMessages((prev) => [
        { text: `Связь установлена.`, color: 'LimeGreen' },
        ...prev,
    ]);
        return nonce;
    } catch (error) {
        console.error("Хьюстон, у нас проблемы с нонсе:", error);
        throw error;
    } finally {
        setNonceInitializing(false);
    }
};

	
useEffect(() => {
    setLogMessages((prev) => {
        if (prev.some(msg => msg.text === "Устанавливаем связь с астероидом...")) {
            return prev; // Сообщение уже существует, не добавляем
        }
        return [{ text: "Устанавливаем связь...", color: '#bcbf00' }, ...prev];
    });

    // Добавляем серые точки через 500 и 1000 миллисекунд
    const timer1 = setTimeout(() => {
        setLogMessages((prev) => [
            { text: ".", color: 'gray' },
            ...prev,
        ]);
    }, 500);

    const timer2 = setTimeout(() => {
        setLogMessages((prev) => [
            { text: ".", color: 'gray' },
            ...prev,
        ]);
    }, 1000);

    // Очищаем таймеры при размонтировании
    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
}, []);



	
useEffect(() => {
	
    const initialize = async () => {
        if (!isKeyConfirmed) return; // Ensure the key is confirmed before initializing nonce
        try {
            await new Promise((resolve) => setTimeout(resolve, 7000)); // Задержка 7 секунд
            const nonce = await initializeNonce(provider, setNonceInitializing);
            setCurrentNonce(nonce); // Устанавливаем nonce в состояние
        } catch (error) {
            console.error("Ошибка при инициализации nonce:", error);
        }
    };

    initialize(); // Инициализация при монтировании компонента или когда privateSigner is set
}, [provider, isKeyConfirmed]); // Add isKeyConfirmed to dependencies





	
/*		
useEffect(() => {
    const reinitializeNonce = async () => {
        try {
            const nonce = await initializeNonce(provider, setNonceInitializing);
            setCurrentNonce(nonce); // Устанавливаем новый nonce
        } catch (error) {
            console.error("Ошибка при переинициализации nonce:", error);
        }
    };

    if (dynamicEarlyValue > 50 && dynamicEarlyValue < 10000000) {
        reinitializeNonce(); // Инициализация, если значение в пределах диапазона
    }
}, [dynamicEarlyValue]); // Следим за dynamicEarlyValue
*/
	
const randomNum = Math.floor(Math.random() * 1000000) + 1;
let externalNonce = null; // Инициализация внешней переменной

const sendTransaction = async (contractMethod, params = [], contractAddress, contractABI) => {
    if (parseInt(depot.theEndCount, 10) <= 100 && isGamePaused === 1 && contractMethod !== "unsetPause" && contractMethod !== "initializeGrid" & contractMethod !== "updatePlayerName" & contractMethod !== "updatePlayerLink") {
        console.log(`Транзакция "${contractMethod}" заблокирована.`);
		/*
		setLogMessages((prev) => [
            { text: `Пауза`, color: 'red' },
            ...prev.slice(1),
        ]);
*/

        return;
    }

    if (isNonceInitializing) {
        console.log("Ожидание завершения инициализации nonce...");
        while (isNonceInitializing) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }

    if (currentNonce === null) {
		
        setLogMessages((prev) => [
            { text: `Дождитесь связи с астероидом.`, color: 'red' },
            ...prev.slice(1),
        ]);

        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 500);
		
				setlogBigErrorMessage("Нет связи.");
setTimeout(() => setlogBigErrorMessage(""), 2000);
        return;
    }

    // Синхронизируем externalNonce с currentNonce при первом использовании
    if (externalNonce === null) {
        externalNonce = currentNonce;
    }

    const nonceToUse = externalNonce;
    externalNonce += 1; // Инкрементируем локальную переменную

    setCurrentNonce(externalNonce); // Обновляем состояние React

    const randomNum = Math.floor(Math.random() * 1000000) + 1;
    const updatedParams = [...params, randomNum];

    transactionQueue.push({
        contractMethod,
        params: updatedParams,
        contractAddress,
        contractABI,
        nonce: nonceToUse,
    });

    if (!isProcessing) {
        isProcessing = true;
        try {
            await processQueue();
        } catch (error) {
            console.error("Ошибка при обработке очереди транзакций:", error);
        } finally {
            isProcessing = false;
        }
    }
};




const processQueue = async () => {
    try {
        let signerInstance;
        if (userPrivateKey) {
            signerInstance = new ethers.Wallet(userPrivateKey, provider);
        } else if (provider) {
            signerInstance = provider.getSigner();
        } else {
            throw new Error("Provider не инициализирован. Убедитесь, что кошелек подключен.");
        }

        while (transactionQueue.length > 0) {
            const transaction = transactionQueue[0];
            try {
               // console.log(`Processing transaction ${transaction.contractMethod} with nonce ${transaction.nonce}`);

                await executeTransaction(
                    transaction.contractMethod,
                    transaction.params,
                    transaction.contractAddress,
                    transaction.contractABI,
                    signerInstance
                );

               // console.log(`Transaction ${transaction.contractMethod} successful with nonce ${transaction.nonce}`);
            } catch (error) {
                console.error(`Ошибка выполнения транзакции ${transaction.contractMethod} с nonce ${transaction.nonce}:`, error);
            }

            // Удаляем транзакцию из очереди в любом случае
            transactionQueue.shift();
        }
    } catch (error) {
        console.error("Ошибка обработки очереди транзакций:", error);
    }
};




const executeTransaction = async (contractMethod, params = [], contractAddressIN, contractAbiIN, signer) => {
    const cellId = params.length >= 2 ? `${params[0]}-${params[1]}` : null;

    try {
		
		

if (contractMethod != 'updateCoal') {
    setLogMessages((prev) => [
        { text: `Отправляем сигнал...`, color: '#bcbf00' },
        ...prev,
    ]);
}
		


        setLoading(true);

        const newContract = new ethers.Contract(contractAddressIN, contractAbiIN, signer);

        //console.log("Отправляем транзакцию");

        if (cellId) {
            setActiveCells((prev) => [...prev, cellId]);

            setTimeout(() => {
                setActiveCells((prev) => prev.filter((id) => id !== cellId));
            }, 50000);
        }

        //const gasLimit = 15000000;
const gasPrice = ethers.utils.parseUnits('0.01', 'gwei'); // Устанавливаем 0.003 Gwei вручную
const estimatedGas = await gasLLimit(contractMethod, params, newContract);
const gasLimit = Math.ceil(2 * estimatedGas); // Округляем вверх для надёжности

        const tx = params.length
            ? await newContract[contractMethod](...params, { nonce: currentNonce, gasLimit: gasLimit,
          gasPrice: gasPrice, })
            : await newContract[contractMethod]({ nonce: currentNonce, gasLimit: gasLimit,
          gasPrice: gasPrice, });


console.log(`Ушла ${currentNonce} (м: ${contractMethod})`);

        // Ожидаем подтверждения транзакции
        await tx.wait();
		
		
if (contractMethod != 'updateCoal'){ 
//if (contractMethod != 'updateCoal') {
    setLogMessages((prev) => [
        { text: `Сигнал отправлен.`, color: 'LimeGreen' },
        ...prev,
    ]);







        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 500);

        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 1000);
		
}		
		
    } catch (error) {
		
		
		//console.error("Ошибка executeTransaction:", error);


        console.error(`executeTransaction ${contractMethod} :`, truncateError(error));
		
		
		
		
        setLogMessages((prev) => [
            { text: `${contractMethod} ${error.message}`, color: 'red' },
            ...prev.slice(1),
        ]);

        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 500);

        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 1000);

        setTimeout(() => {
            setLogMessages((prev) => [{ text: '.', color: 'gray' }, ...prev]);
        }, 1500);
//}





        if (cellId) {
            setActiveCells((prev) => prev.filter((id) => id !== cellId));
        }


    } finally {
        setLoading(false);
    }
};


































































































































































































































































































// Переменная для хранения времени последней проверки nonce


useEffect(() => {
    const intervalId = setInterval(async () => {
        const currentTime = new Date().getSeconds();
        if (currentTime % 15 === 0) {
            //console.log("Проверка nonce");

            // Вызов функции, которая сама управляет переменными
            await checkAndFixNonce();
        }
    }, 950);

    return () => clearInterval(intervalId); // Очищаем интервал при размонтировании
}, [userPrivateKey,provider,currentNonce]); // Убираем зависимости

let isFixingNonce = false;

const checkAndFixNonce = async () => {
	if (isFixingNonce) {
    console.log("checkAndFixNonce уже выполняется...");
    return;
}
isFixingNonce = true;

	
    try {
        let signerInstance;
        if (userPrivateKey) {
            signerInstance = new ethers.Wallet(userPrivateKey, provider);
        } else if (provider) {
            signerInstance = provider.getSigner();
        } else {
            throw new Error("Provider не инициализирован. Убедитесь, что кошелек подключен.");
        }

        const userAddress = await signerInstance.getAddress();
        const networkNonce = await provider.getTransactionCount(userAddress);

        // Проверка разницы между currentNonce и networkNonce
        const nonceDifference = currentNonce - networkNonce;
		console.log(`Разница: ${nonceDifference}`);
        if (nonceDifference > 5) {
			
			
            console.log(`⚠️  Разница: ${nonceDifference}`);
			/*
			setRaznica(true);
			
						    setLogMessages((prev) => [
        { text: `Разница:${nonceDifference}`, color: 'red' },
        ...prev,
    ]);
	*/
        } else {
if (raznica) {
    setRaznica(false);
}
}
        if (currentNonce > networkNonce+5) {
            //console.log("Проверяем время последней транзакции через API...");

            // URL для API-запроса с ограничением на последние 100 транзакций
            const apiUrl = `https://pacific-explorer.sepolia-testnet.manta.network/api?module=account&action=txlist&address=${userAddress}&startblock=2672807&endblock=99999999&sort=desc&offset=100`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.status === "1" && data.result.length > 0) {
                    const lastTransaction = data.result[0];
                    const lastTransactionTime = parseInt(lastTransaction.timeStamp) * 1000; // Время в миллисекундах

                    const timeDiffSeconds = Math.floor((Date.now() - lastTransactionTime) / 1000); // Разница в секундах

                    /* console.log(
                        `Последняя транзакция была выполнена ${timeDiffSeconds} секунд назад `
                    ); */

                    if (timeDiffSeconds > 25) {
                        console.log("Пробуем исправить пропущенные nonce вызовом EmptyFunctionForNonce");
                        const contract = new ethers.Contract(contractAddressAAA, SimpleGridAbiAAA, signerInstance);

for (let i = networkNonce; i < currentNonce; i++) {
    try {
        await contract.EmptyFunctionForNonce(i, { nonce: i });
        console.log(`Nonce ${i} успешно потрачен.`);
    } catch (error) {
        console.error(`Ошибка при вызове EmptyFunctionForNonce для nonce ${i}:`, error.message);
    }
}


                        // Здесь удалено изменение currentNonce напрямую
                    }
                } else {
                    console.log("Транзакции не найдены для данного адреса или произошла ошибка API.");
                }

            } catch (apiError) {
                console.error("Ошибка при запросе к API для получения транзакций:", apiError);
            }
        } else {
            // console.log("Все в порядке с nonce.");
        }
    } catch (error) {
        console.error("Ошибка при проверке/исправлении nonce:", error);
    } finally  {
    isFixingNonce = false;
	}

	
	
	
	
};


const truncateError = (error, maxLength = 10000) => {
    const errorMessage = error.toString(); // Преобразуем ошибку в строку
    if (errorMessage.length > maxLength) {
        return `${errorMessage.slice(0, maxLength)}... [Обрезано]`;
    }
    return errorMessage;
};




































useEffect(() => {
    if (!provider) return;

    // Инициализация контрактов
    const contractBBB = new ethers.Contract(contractAddressBBB, SimpleGridAbiBBB, provider);
    const contractAAA = new ethers.Contract(contractAddressAAA, SimpleGridAbiAAA, provider);
    const contractMain = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, provider);
    const contractCCC = new ethers.Contract(contractAddressCCC, SimpleGridAbiCCC, provider);

    const handleAllEventsBBB = (log) => {
        try {
            const parsedLog = contractBBB.interface.parseLog(log); // Парсим лог события
            console.log("Событие из BBB:", parsedLog);
        } catch (error) {
            console.error("Ошибка при обработке события из BBB:", error);
        }
    };

    const handleAllEventsAAA = (log) => {
        try {
            const parsedLog = contractAAA.interface.parseLog(log); // Парсим лог события
            console.log("Событие из AAA:", parsedLog);
        } catch (error) {
            console.error("Ошибка при обработке события из AAA:", error);
        }
    };

    const handleAllEventsMain = (log) => {
        try {
            const parsedLog = contractMain.interface.parseLog(log); // Парсим лог события
            console.log("Событие из Main:", parsedLog);
        } catch (error) {
            console.error("Ошибка при обработке события из Main:", error);
        }
    };

    const handleAllEventsCCC = (log) => {
        try {
            const parsedLog = contractCCC.interface.parseLog(log); // Парсим лог события
            console.log("Событие из CCC:", parsedLog);
        } catch (error) {
            console.error("Ошибка при обработке события из CCC:", error);
        }
    };

    // Слушаем события для BBB
    provider.on(
        {
            address: contractAddressBBB,
            topics: [],
        },
        handleAllEventsBBB
    );

    // Слушаем события для AAA
    provider.on(
        {
            address: contractAddressAAA,
            topics: [],
        },
        handleAllEventsAAA
    );

    // Слушаем события для Main
    provider.on(
        {
            address: contractAddressMain,
            topics: [],
        },
        handleAllEventsMain
    );

    // Слушаем события для CCC
    provider.on(
        {
            address: contractAddressCCC,
            topics: [],
        },
        handleAllEventsCCC
    );

    // Очистка подписки при размонтировании компонента
    return () => {
        provider.off(
            {
                address: contractAddressBBB,
                topics: [],
            },
            handleAllEventsBBB
        );
        provider.off(
            {
                address: contractAddressAAA,
                topics: [],
            },
            handleAllEventsAAA
        );
        provider.off(
            {
                address: contractAddressMain,
                topics: [],
            },
            handleAllEventsMain
        );
        provider.off(
            {
                address: contractAddressCCC,
                topics: [],
            },
            handleAllEventsCCC
        );
    };
}, [provider]);







    useEffect(() => {
        if (logMessages.length > 100) {
            setLogMessages((prev) => prev.slice(0, 100)); // Оставляем только первые 100 элементов
        }
    }, [logMessages]);
	
	
	
	
	/*


const prevDynamicEarlyValue = useRef(null);

useEffect(() => {
    if (
        prevDynamicEarlyValue.current !== null && // Убедимся, что это не первый рендер
        prevDynamicEarlyValue.current < 60 && // Предыдущее значение было меньше 50
        dynamicEarlyValue >= 60 && // Текущее значение стало 50 или больше
        !hasEarlyAlertShown // Алерт еще не был показан
    ) {
        alert("Хьюстон, у нас проблемы - долго нет связи с астероидом - обновление страницы может помочь.");
        setHasEarlyAlertShown(true); // Обновляем состояние, чтобы алерт не показывался повторно
    }

    // Обновляем предыдущее значение
    prevDynamicEarlyValue.current = dynamicEarlyValue;
}, [dynamicEarlyValue, hasEarlyAlertShown]);

*/
		useEffect(() => {
			if (action === "placeBulldozer") {
				document.body.classList.add("placeBulldozer");
			}
			else {
				document.body.classList.remove("placeBulldozer");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeBulldozer");
		}, [action]);
		useEffect(() => {
			if (action === "placeBox") {
				document.body.classList.add("placeBox");
			}
			else {
				document.body.classList.remove("placeBox");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeBox");
		}, [action]);
		useEffect(() => {
			if (action === "removeTool") {
				document.body.classList.add("removeTool");
			}
			else {
				document.body.classList.remove("removeTool");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("removeTool");
		}, [action]);
		useEffect(() => {
			if (action === "placeManUD") {
				document.body.classList.add("placeManUD");
			}
			else {
				document.body.classList.remove("placeManUD");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeManUD");
		}, [action]);
		useEffect(() => {
			if (action === "placeManLR") {
				document.body.classList.add("placeManLR");
			}
			else {
				document.body.classList.remove("placeManLR");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeManLR");
		}, [action]);
		useEffect(() => {
			if (action === "placeManDU") {
				document.body.classList.add("placeManDU");
			}
			else {
				document.body.classList.remove("placeManDU");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeManDU");
		}, [action]);
		
		
		useEffect(() => {
			if (action === "placeManRL") {
				document.body.classList.add("placeManRL");
			}
			else {
				document.body.classList.remove("placeManRL");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeManRL");
		}, [action]);
		
		
		
		
			useEffect(() => {
			if (action === "placeWall") {
				document.body.classList.add("placeWall");
			}
			else {
				document.body.classList.remove("placeWall");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeWall");
		}, [action]);
		
		
			
		
		
		useEffect(() => {
			if (action === "wallF") {
				document.body.classList.add("wallF");
			}
			else {
				document.body.classList.remove("wallF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("wallF");
		}, [action]);		
			
		
		
		useEffect(() => {
			if (action === "componentsF") {
				document.body.classList.add("componentsF");
			}
			else {
				document.body.classList.remove("componentsF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("componentsF");
		}, [action]);
		useEffect(() => {
			if (action === "boxesF") {
				document.body.classList.add("boxesF");
			}
			else {
				document.body.classList.remove("boxesF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("boxesF");
		}, [action]);
		useEffect(() => {
			if (action === "mansF") {
				document.body.classList.add("mansF");
			}
			else {
				document.body.classList.remove("mansF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("mansF");
		}, [action]);
		useEffect(() => {
			if (action === "furnaceF") {
				document.body.classList.add("furnaceF");
			}
			else {
				document.body.classList.remove("furnaceF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("furnaceF");
		}, [action]);
		useEffect(() => {
			if (action === "factoryF") {
				document.body.classList.add("factoryF");
			}
			else {
				document.body.classList.remove("factoryF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("factoryF");
		}, [action]);
		useEffect(() => {
			if (action === "bulldozerF") {
				document.body.classList.add("bulldozerF");
			}
			else {
				document.body.classList.remove("bulldozerF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("bulldozerF");
		}, [action]);
		useEffect(() => {
			if (action === "drillsF") {
				document.body.classList.add("drillsF");
			}
			else {
				document.body.classList.remove("drillsF");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("drillsF");
		}, [action]);
		useEffect(() => {
			if (action === "placeFurnace") {
				document.body.classList.add("placeFurnace");
			}
			else {
				document.body.classList.remove("placeFurnace");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeFurnace");
		}, [action]);
		useEffect(() => {
			if (action === "placeFactory") {
				document.body.classList.add("placeFactory");
			}
			else {
				document.body.classList.remove("placeFactory");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeFactory");
		}, [action]);
		useEffect(() => {
			if (action === "placeDrill") {
				document.body.classList.add("placeDrill");
			}
			else {
				document.body.classList.remove("placeDrill");
			}
			// Удаляем класс при размонтировании компонента
			return () => document.body.classList.remove("placeDrill");
		}, [action]);
		
		
		useEffect(() => {
			const interval = setInterval(() => {
				const currentTime = Math.floor(Date.now() / 1000); // Текущее время
				const difference = currentTime - depot.blocktimestamp - depot.early;
				//const difference = depot.early;
				const distance = currentTime - depot.starttimee;
				setDistance(distance); // Устанавливаем расстояние
				const hours = Math.floor(difference / 3600);
				const minutes = Math.floor((difference % 3600) / 60);
				const seconds = difference % 60;
				let formattedTime = '';
				formattedTime += `${hours} ч. `;
				formattedTime += `${minutes} мин. `;
				formattedTime += `${seconds} сек.`;
				setTimePassed(formattedTime); // Обновление состояния
			}, 1000); // Обновляется каждую секунду
			return () => clearInterval(interval); // Очистка интервала при размонтировании
		}, [depot.lastmeteoritTimeChecked]);
		
		
		
		
		
		
		/*
		const executeAllFunctions = async () => {
			
			updateCoal();
			//console.log("Meteorit function executed successfully.");
		};
		*/
		
		
		
		const getCell = async (x, y) => {
			let signer, newContract;
			try {
				// Получаем данные ячейки
				const signer = getSigner();
				// Инициализируем контракт с подписантом
				const newContract = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, signer);
				const userAddress = await signer.getAddress();
				const cell = await newContract.getCell(userAddress, x, y);
				// Формируем сообщение со всеми данными ячейки
				const cellDataMessage = `   Cell Data at (${x}, ${y}):
Content: ${cell.content}
Tool: ${cell.tool}
Coal Amount: ${cell.coalAmount}
Last Time Checked: ${cell.lastTimeChecked}
Man: ${cell.man}
Iron Amount: ${cell.ironAmount}
Iron Plate Amount: ${cell.ironplateAmount}
Components Amount: ${cell.componentsAmount}
Factory Settings: ${cell.factorySettings}
wallPowerAmount: ${cell.wallPowerAmount}
`;
			
				console.log(cellDataMessage);
				
				
				setLogMessages(prev => [{
					text: cellDataMessage,
					color: 'gray'
				}, ...prev]);
			}
			catch (error) {
				console.error("Ошибка getCell:", error);
			}
		};





		const getDepot = async () => {
			let signer, newContract;
			try {
				// Получаем данные депо
				const signer = getSigner();
				// Инициализируем контракт с подписантом
				newContract = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, signer);
				const userAddress = await signer.getAddress(); // Адрес пользователя из MetaMask
				const depot = await newContract.getDepot(userAddress);
				// Формируем сообщение со всеми данными депо
				const depotDataMessage = `
${depot.normalizedTime} - normalizedTime
${depot.speedkoef} - speedkoef
${depot.gridSize} - gridSize
${depot.drillsAmount} - drillsAmount
${depot.boxesAmount} - boxesAmount
${depot.mansAmount} - mansAmount
${depot.furnaceAmount} - furnaceAmount
${depot.factoryAmount} - factoryAmount
${depot.starttimee} - starttimee
${depot.lastmeteoritTimeChecked} - lastmeteoritTimeChecked
${depot.blocktimestamp} - blocktimestamp
${depot.bulldozerAmount} - bulldozerAmount
${depot.wallAmount} - wallAmount
${depot.early} - early
${depot.mmmtime} - mmmtime
${depot.mmmdrillSpeed} - mmmdrillSpeed
${depot.iterationLimitDepot} - iterationLimitDepot
${depot.isPaused} - isPaused (1 - Pause, 0 - Game)
${depot.pausedDuration} - pausedDuration
${depot.pauseStartTime} - pauseStartTime
${depot.theEndCount} - theEndCount
${depot.trainingCompleted} - trainingCompleted
${depot.lastUpdateTime} - lastUpdateTime
${depot.frequencyFactor} - frequencyFactor
${depot.gotoLevel} - gotoLevel
`;
				
				console.log(depotDataMessage);
				
				setLogMessages(prev => [{
					text: depotDataMessage,
					color: 'gray'
				}, ...prev]);
			}
			catch (error) {
				console.error("Ошибка getDepot:", error);
			}
		};











const updateTrainingCompleted = () => {
    sendTransaction("updateTrainingCompleted", [trainingCompletedState], contractAddressAAA, SimpleGridAbiAAA);
};




		const placeDrill = (x, y) => {
			sendTransaction("placeDrill", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const removeTool = (x, y) => {
			sendTransaction("removeTool", [x, y], contractAddressBBB, SimpleGridAbiBBB);
		};
		const placeBox = (x, y) => {
			sendTransaction("placeBox", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};

		const placeWall = (x, y) => {
			sendTransaction("placeWall", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};

		const placeFurnace = (x, y) => {
			sendTransaction("placeFurnace", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const placeFactory = (x, y) => {
			sendTransaction("placeFactory", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const placeBulldozer = (x, y) => {
			sendTransaction("placeBulldozer", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const initializeGrid = () => {
			sendTransaction("initializeGrid", [], contractAddressAAA, SimpleGridAbiAAA);
		};
		const updateCoal = () => {
			sendTransaction("updateCoal", [], contractAddressBBB, SimpleGridAbiBBB);
		};
		const setPause = () => {
			sendTransaction("setPause", [], contractAddressAAA, SimpleGridAbiAAA);
		};
		const unsetPause = () => {
			sendTransaction("unsetPause", [], contractAddressAAA, SimpleGridAbiAAA);
		};		
		const setGotoLevel = () => {
			sendTransaction("setGotoLevel", [110], contractAddressAAA, SimpleGridAbiAAA);
		};			
		
const togglePause = () => {
    if (isGamePaused === 1) {
        unsetPause();
    } else {
        setPause();
    }
};		
		
		
		
		
		
		
		
		const meteoritfunction = () => {
			sendTransaction("meteoritfunction", [], contractAddressBBB, SimpleGridAbiBBB);
		};
		const placeManLR = (x, y) => {
			sendTransaction("placeManLR", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const placeManRL = (x, y) => {
			sendTransaction("placeManRL", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const placeManUD = (x, y) => {
			sendTransaction("placeManUD", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const placeManDU = (x, y) => {
			sendTransaction("placeManDU", [x, y], contractAddressAAA, SimpleGridAbiAAA);
		};
		const handleCellClick2 = async (cell) => {
			setSelectedCell2(cell);
		}
		const handleCellClick = async (cell) => {
			if (!buttonActionRef.current) {
			setSelectedCell(cell);
			if (action) {
				const {
					x,
					y
				} = cell;
				// Добавляем клетку в список активных
				try {
					switch (action) {
						case "drillsF":
							await sendTransaction("factorySettingsUpdate", [x, y, "drillsF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "boxesF":
							await sendTransaction("factorySettingsUpdate", [x, y, "boxesF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "mansF":
							await sendTransaction("factorySettingsUpdate", [x, y, "mansF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "furnaceF":
							await sendTransaction("factorySettingsUpdate", [x, y, "furnaceF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "factoryF":
							await sendTransaction("factorySettingsUpdate", [x, y, "factoryF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "bulldozerF":
							await sendTransaction("factorySettingsUpdate", [x, y, "bulldozerF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "wallF":
							await sendTransaction("factorySettingsUpdate", [x, y, "wallF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "componentsF":
							await sendTransaction("factorySettingsUpdate", [x, y, "componentsF"], contractAddressAAA, SimpleGridAbiAAA);
							break;
						case "placeDrill":
							await placeDrill(x, y);
							break;
						case "removeTool":
							await removeTool(x, y);
							break;
						case "placeBox":
							await placeBox(x, y);
							break;
						case "placeWall":
							await placeWall(x, y);
							break;
						case "placeFurnace":
							await placeFurnace(x, y);
							break;
						case "placeFactory":
							await placeFactory(x, y);
							break;
						case "placeBulldozer":
							await placeBulldozer(x, y);
							break;
						case "placeManLR":
							await placeManLR(x, y);
							break;
						case "placeManRL":
							await placeManRL(x, y);
							break;
						case "placeManUD":
							await placeManUD(x, y);
							break;
						case "placeManDU":
							await placeManDU(x, y);
							break;
						case "getCell":
							getCell(x, y);
							break;
						default:
							console.error("Не выбрано действие");
					}
				}
				catch (error) {
					console.error("Ошибка при обработке действия:", error);
				}
				finally {
					// Убираем клетку из списка активных через 30 секунд
				}
			}
			}
			 buttonActionRef.current = false;
		};
		
		
		
		
		const getButtonColorwhite = (actionType) => {
			return "#767999";
		};
		
		const getButtonborderStyle = (actionType) => {
			if (action === actionType) {
				return "inset";
			}
			return "outset";
		};
		const getButtonColor = (actionType) => {
			if (action === actionType) {
				return "blue";
			}
			return "#767999";
		};		const executeAction = async (manualAction = null) => {
			const currentAction = manualAction || action;
			switch (currentAction) {
				case "getDepot":
					await getDepot();
					break;
				case "initializeGrid":
					await initializeGrid();
					break;
					/*
				case "updateCoal":
					await updateCoal();
					break;
					*/
					/*
				case "updateAll":
					await executeAllFunctions();
					break;
					*/
				case "meteoritfunction":
					await meteoritfunction();
					break;
				case "fetchGrid":
					await fetchGrid();
					break;
					
					
case "updatePlayerName":
    const newName = prompt("Введите новое имя или ник:");
    if (newName) {
        try {
            await sendTransaction("updatePlayerName", [newName], contractAddressAAA, SimpleGridAbiAAA);
            console.log(`Имя игрока обновлено на: ${newName}`);
        } catch (error) {
            console.error("Ошибка при обновлении имени игрока:", error);
        }
    } else {
        console.error("Имя игрока не было обновлено, так как оно не было введено.");
    }
    break;

case "updatePlayerLink":
    const newLink = prompt("Введите новую ссылку:");
    if (newLink) {
        try {
            await sendTransaction("updatePlayerLink", [newLink], contractAddressAAA, SimpleGridAbiAAA);
            console.log(`Ссылка игрока обновлена на: ${newLink}`);
        } catch (error) {
            console.error("Ошибка при обновлении ссылки игрока:", error);
        }
    } else {
        console.error("Ссылка игрока не была обновлена, так как она не была введена.");
    }
    break;

					
					
					
				default:
					console.error("console.error: executeAction");
			}
			setAction("getCell"); // Сбрасываем действие после выполнения
		};
		

		
    const [selectedSpeed, setSelectedSpeed] = useState("?x");

const handleSpeedChange = (speed) => {
    setSelectedSpeed(speed);

    const multiplier = parseInt(speed.replace("x", ""), 10);

    // Отправляем транзакцию на изменение speedkoef через контракт AAA
    sendTransaction("updateSpeedKoef", [multiplier], contractAddressAAA, SimpleGridAbiAAA);
};


		/*
useEffect(() => {
    if (currentNonce === null) return;

    const multiplier = parseInt(selectedSpeed.replace("x", ""), 10); 
    const decrementValue = 20 * multiplier - 20; 

    const intervalstarttimeeUpdate = setInterval(async () => {
        const currentSeconds = new Date().getSeconds();
        if (currentSeconds % 20 === 0) {
            try {
                sendTransaction("starttimeeUpdate", [decrementValue], contractAddressAAA, SimpleGridAbiAAA);
            } catch (error) {
                // Обработка ошибок при отправке транзакции
            }
        }
    }, 990);

    return () => {
        clearInterval(intervalstarttimeeUpdate);
    };
}, [selectedSpeed, currentNonce]);

		
		*/
const calculateMeteoriteFrequency = (normalizedTime) => {
    const a = 0.05; // Коэффициент a
    const k = 0.00018; // Коэффициент k
    return a * Math.exp(k * normalizedTime) + 1;
};
		
		
useEffect(() => {
    if (depot.normalizedTime) {
        const frequency = calculateMeteoriteFrequency(depot.normalizedTime);
        setMeteoriteFrequency(frequency); // Обновляем состояние
    }
}, [depot.normalizedTime]);
		
		
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key && (event.key.toLowerCase() === "q" || event.key.toLowerCase() === "й")) {
                setAction("getCell");
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []); // Пустой массив зависимостей, чтобы установить обработчик один раз


 const frequencyFactor = parseFloat(depot.frequencyFactor) / 10 ** 18;

// Предположим, что frequencyFactor = 1 означает 1 метеорит за 20 секунд.
const meteorFrequencyInSeconds = frequencyFactor / 20 ;
    const formattedDensity = meteorFrequencyInSeconds.toFixed(2); // Обрезаем до 4 знаков после запятой
			
		
useEffect(() => {
    const interval = setInterval(() => {
        if (isGamePaused === 1 && parseInt(depot.theEndCount, 10) > 100) {
            setlogBigErrorMessage("Пауза");
        } else if (isGamePaused === 0 && parseInt(depot.theEndCount, 10) > 100) {
            setlogBigErrorMessage("");
        }
    }, 3000); // Интервал в 5 секунд

    return () => clearInterval(interval); // Очистка интервала при размонтировании
}, [isGamePaused,depot.theEndCount]);

		/*
const showTopPlayersAlert = () => {
    const topPlayers = [
        { name: "Player1", link: "https://google.com" },
        { name: "Player2", link: "https://google.com" },
        { name: "Player3", link: "https://google.com" },
    ];

    const message = topPlayers
        .map(player => `${player.name}: ${player.link}`)
        .join("\n");

    alert(`Top Players:\n\n${message}`);
};
*/

/*
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };		
	*/
	


const openModal = async () => {
    try {
        const signer = getSigner();
        const contract = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, provider);

        const players = await contract.getTopPlayers();

        // Сохраняем и отображаем всех игроков
        const formattedPlayers = await Promise.all(
            players.map(async (player, index) => {
                if (!Array.isArray(player) || player.length < 2) {
                    console.warn(`Игрок ${index + 1} имеет некорректные данные:`, player);
                    return {
                        address: "Unknown",
                        score: "0", // Значение по умолчанию
                        bestScore: "N/A",
                        name: "N/A",
                        firstGameTimestamp: "N/A",
                        link: "N/A",
                        rank: index + 1,
                    };
                }

                const address = player[0];
                const score = player[1].toString();

                const playerStatResult = await contract.getPlayerstat(address);
                const playerStatsData = {
                    bestScore: playerStatResult.bestScore.toString(),
                    name: playerStatResult.name,
                    firstGameTimestamp: (() => {
                        try {
                            if (!playerStatResult.firstGameTimestamp) {
                                return "N/A";
                            }

                            const timestamp = parseInt(playerStatResult.firstGameTimestamp.toString(), 10);

                            if (timestamp <= 0) {
                                return "N/A";
                            }

                            return new Date(timestamp * 1000).toLocaleDateString();
                        } catch (error) {
                            console.error("Ошибка при обработке firstGameTimestamp:", error);
                            return "N/A";
                        }
                    })(),
                    link: playerStatResult.link,
                };

                return {
                    address,
                    score,
                    ...playerStatsData,
                    rank: index + 1,
                };
            })
        );

        setTopPlayers(formattedPlayers);
        setIsModalOpen(true);
    } catch (error) {
        console.error("Ошибка при получении топ-игроков:", error);
    }
};







    const closeModal = () => {
        setIsModalOpen(false);
    };	
	
    const closeChronicle = () => {
        setIsChronicleOpen(false);
    };		
	
	
    const closeSchool = () => {
        setIsSchoolOpen(false);
    };	

	
const calculatedDistance = depot.gotoLevel === "110" 
    ? depot.normalizedTime 
    : depot.gotoLevel === "100" 
    ? "0" 
    : null;



const fetchContractsChain = async () => {
    if (!provider) {
        throw new Error("Provider is not initialized."); // Бросаем ошибку, если провайдер не инициализирован
    }

    try {
        const mainGridContract = new ethers.Contract(
            contractAddressMain,
            SimpleGridAbiMAIN,
            provider
        );

        let currentContractAddress = await mainGridContract.previous();
        const chain = [{ address: contractAddressMain, name: 'MainGrid' }];

        while (currentContractAddress !== ethers.constants.AddressZero) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Задержка

            try {
                const previousContract = new ethers.Contract(
                    currentContractAddress,
                    SimpleGridAbiMAIN,
                    provider
                );

                let contractName = "Previous Contract";

                try {
                    const contractInfo = await previousContract.getContractInfo();
                    if (contractInfo && contractInfo.name) {
                        contractName = contractInfo.name;
                    }
                } catch (e) {
                    console.log("Error getting contract name", e);
                }

                chain.unshift({ address: currentContractAddress, name: contractName });
                console.log("Current contract added:", { address: currentContractAddress, name: contractName });

                currentContractAddress = await previousContract.previous();
            } catch (error) {
                console.error("Error fetching previous contract:", error);
                break; // Останавливаем цикл при ошибке
            }
        }

        setContractsChain(chain);
        console.log("Contracts chain:", chain);
        return chain; 
    } catch (error) {
        console.error("Error fetching contracts chain:", error);
        throw error; // Бросаем ошибку при общей ошибке
    }
};

	
const getAllChronicles = (chain) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newChronicles = [];

            for (let i = 0; i < chain.length; i++) {
                const contractData = chain[i];
                const contractAddress = contractData.address;

                try {
                    const contract = new ethers.Contract(
                        contractAddress,
                        SimpleGridAbiMAIN,
                        provider
                    );

                    const firstRecordId = await contract.firstRecordId();
                    const nextRecordId = await contract.nextRecordId();

for (let id = Number(firstRecordId); id < Number(nextRecordId); id++) {
    try {
        const chronicleData = await contract.getChronicle(id);
        newChronicles.push({
            contract: {
                address: contractAddress,
                numberInMassive: i,
            },
            chronicle: {
                id: id.toString(),
                recordScore: chronicleData[0]?.toString() || "N/A",
                recordAddress: chronicleData[1] || "Адрес не найден",
                recordName: chronicleData[2] || "Имя не найдено",
                recordMessage: chronicleData[3] || "Сообщение отсутствует",
                recordTime: chronicleData[4] ? new Date(chronicleData[4] * 1000).toLocaleString() : "Время не найдено" // Добавляем время записи
            }
        });
        console.log("Chronicle added:", {
            contract: { address: contractAddress, numberInMassive: i },
            chronicle: { id: id.toString(), recordScore: chronicleData[0].toString(), recordAddress: chronicleData[1], recordName: chronicleData[2], recordMessage: chronicleData[3], recordTime: chronicleData[4] ? new Date(chronicleData[4] * 1000).toLocaleString() : "Время не найдено" }
        });
    } catch (chronicleError) {
        console.error(`Error getting chronicle with ID ${id} from ${contractAddress}:`, chronicleError);
        newChronicles.push({
            contract: {
                address: contractAddress,
                numberInMassive: i,
            },
            chronicle: { id: id.toString(), error: chronicleError.message }
        });
    }
}

                } catch (contractError) {
                    console.error(`Error getting contract info from ${contractAddress}:`, contractError);
                    newChronicles.push({
                        contract: {
                            address: contractAddress,
                            numberInMassive: i,
                        },
                        chronicle: { error: contractError.message }
                    });
                }
            }

            setAllChronicles(newChronicles);
			//saveToFile(newChronicles, 'chronicles.json');
            console.log("All chronicles:", newChronicles); // Лог выполняется *после* всех запросов

            resolve(newChronicles); // Промис разрешается *после* лога
        } catch (error) {
            console.error("Error in getAllChronicles:", error);
            reject(error);
        }
    });
};

    useEffect(() => {
        let intervalId;

        const checkPendingChronicles = async () => {
            try {
                if (!provider) {
                    console.error("Провайдер не инициализирован.");
                    return;
                }

                let signerInstance;
                if (userPrivateKey) {
                    signerInstance = new ethers.Wallet(userPrivateKey, provider);
                } else {
                    console.error("Приватный ключ не установлен или не подтверждён.");
                    return;
                }

                // Инициализируем контракт с подписантом
                const newContract = new ethers.Contract(contractAddressMain, SimpleGridAbiMAIN, signerInstance);

                // Получаем адрес пользователя из MetaMask
                const userAddress = await signerInstance.getAddress();

                // Проверяем pendingChronicles
                const recordId = await newContract.pendingChronicles(userAddress);
                if (recordId > 0 && !hasPendingPopupBeenShown) {
                    setPendingRecord(recordId); // Сохраняем ID записи, если он есть
                    setHasPendingPopupBeenShown(true); // Помечаем, что окно уже было вызвано
                    console.log("pendingRecord:", recordId);
                }
            } catch (error) {
                console.error("Ошибка при проверке pendingChronicles:", error);
            }
        };

        // Устанавливаем интервал для вызова checkPendingChronicles
        intervalId = setInterval(checkPendingChronicles, 5184);

        // Очищаем интервал при размонтировании компонента
        return () => {
            clearInterval(intervalId);
        };
    }, [provider, userPrivateKey, hasPendingPopupBeenShown]);
		


const handleSubmit = async () => {
    try {
        // Используем sendTransaction для вызова функции контракта
        await sendTransaction(
            "updatePendingChronicle", // Имя функции контракта
            [name, message],       // Параметры вызова
            contractAddressAAA,       // Адрес контракта
            SimpleGridAbiAAA          // ABI контракта
        );

        // Очищаем pendingRecord после успешного вызова
        setPendingRecord(null);
    } catch (error) {
        console.error("Ошибка при отправке хроники:", error);
    }
};

	
    const handleLater = () => {
        setPendingRecord(null); // Просто закрываем окно
    };

const handleNever = async () => {
    try {
        // Используем sendTransaction для вызова функции контракта
        await sendTransaction(
            "updatePendingChronicle", // Имя функции контракта
            ["empty", "empty"],    // Параметры вызова
            contractAddressAAA,       // Адрес контракта
            SimpleGridAbiAAA          // ABI контракта
        );

        // Очищаем pendingRecord после успешного вызова
        setPendingRecord(null);
    } catch (error) {
        console.error("Ошибка при обновлении хроники с 'Никогда':", error);
    }
};




/*

  const [wallets, setWallets] = useState([]);
  const count = 3; // Количество кошельков для генерации
 const [hasGenerated, setHasGenerated] = useState(false); 
 

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!hasGenerated) {
        // Функция для генерации адресов
        const generateAddresses = (count) => {
          const results = [];
          for (let i = 0; i < count; i++) {
            const wallet = Wallet.createRandom(); // Создаём случайный кошелёк
            results.push({
              number: i + 1, // Номер кошелька
              address: wallet.address, // Ethereum-адрес
              privateKey: wallet.privateKey, // Приватный ключ
            });
          }
          return results;
        };

        // Генерация адресов и сохранение в стейте
        const generatedWallets = generateAddresses(count);
        setWallets(generatedWallets);
        setHasGenerated(true); // Устанавливаем флаг, чтобы больше не вызывалось

        // Сохранение в файл
        const saveToFile = async () => {
          const fileData = JSON.stringify(generatedWallets, null, 2);
          const blob = new Blob([fileData], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "generated_wallets.json";
          link.click();
          URL.revokeObjectURL(url);
        };

        saveToFile();

        // Рассылка ETH на сгенерированные адреса
        if (!userPrivateKey || !provider) {
          console.error("Signer or provider not set.");
          return;
        }

        const signerInstance = new ethers.Wallet(userPrivateKey, provider);

        try {
          const txs = [];
          let nonce = await signerInstance.getTransactionCount();
          for (const wallet of generatedWallets) {
            const tx = {
              to: wallet.address,
              value: ethers.utils.parseEther("0.0001"), // Сумма 0.0001 ETH
              nonce: nonce,
            };

            const sentTx = await signerInstance.sendTransaction(tx);
            console.log(`Transaction sent to ${wallet.address}:`, sentTx.hash);

            await sentTx.wait(); // Дожидаемся подтверждения транзакции
            console.log(`Transaction confirmed for ${wallet.address}`);
            nonce++; // Увеличиваем nonce
          }
        } catch (error) {
          console.error("Error sending transactions:", error);
        }
      }
    }, 5000); // Таймаут 5 секунд

    return () => clearTimeout(timeout); // Очищаем таймаут при размонтировании компонента
  }, [ provider, userPrivateKey]); // Зависимости

*/

	
		
		
		
	if (isUsingPrivateKey && !isKeyConfirmed) {
    //const isMobile = window.innerWidth <= 768;
	

    return (
        <div
            style={{
                position: 'fixed',
                top:'3%', // Установка отступа в зависимости от устройства
                left: '50%',
                transform: 'translateX(-50%)', // Центрирование по горизонтали
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'flex-start', // Чтобы избежать вертикального центрирования
                alignItems: 'center',
                zIndex: 1000,
                color: 'white',
                flexDirection: 'column',
            }}
        >
            {/* Основное окно */}
            <div
                style={{
                    backgroundColor: '#000',
                    border: '0.575px solid #fff', // Увеличено на 15%
                    padding: '17.25px', // Увеличено на 15%
                    borderRadius: '0px',
                    textAlign: 'center',
                    width: '253px', // Увеличено на 15%
                    boxSizing: 'border-box',
                    boxShadow: '0px 0px 11.5px rgba(0,0,0,0.5)', // Увеличено на 15%
                }}
            >
                <p
                    style={{
                        margin: '0 0 9.2px', // Увеличено на 15%
                        fontSize: '14.95px', // Увеличено на 15%
                        color: '#ddd',
                    }}
                >
                    Введите приватный ключ для связи с астероидом. Осторожно, код в
                    основном писал ИИ и он может вас ограбить🤖.
                </p>
                <input
                    type="password"
                    placeholder="Приватный ключ"
                    value={userPrivateKey}
                    style={{
                        width: '100%', // Увеличено на 15%
                        padding: '5.75px 9.2px', // Увеличено на 15%
                        marginBottom: '11.5px', // Увеличено на 15%
                        borderRadius: '0px',
                        fontSize: '13.8px', // Увеличено на 15%
                        border: '1.15px solid #444', // Увеличено на 15%
                        backgroundColor: '#222',
                        color: '#fff',
                        boxSizing: 'border-box',
                    }}
                    onChange={(e) => setUserPrivateKey(e.target.value)}
                />

                <button
                    onClick={() => {
                        if (!userPrivateKey) {
                            alert('Введите приватный ключ.');
                        } else {
                            try {
                                const wallet = new ethers.Wallet(userPrivateKey, provider);
                                setPrivateSigner(wallet);
                                setIsKeyConfirmed(true);
                                console.log("Приватный ключ подтвержден и кошелек подключен.");
                            } catch (error) {
                                alert('Неверный приватный ключ.');
                                console.error("Ошибка при подключении кошелька:", error);
                            }
                        }
                    }}
                    style={{
							width: "70%",
							height: '28.19px',
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'pointer',
							boxSizing: 'border-box',
							backgroundColor: isPressed ? 'blue' : '#28a745', // Изменение цвета фона при нажатии
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: isPressed ? 'inset' : 'outset', // Изменение стиля границы
							borderColor: 'buttonborder',
							borderImage: 'initial',
							color: 'white',
							//letterSpacing: '0.410em',
                    }}
                >
                    Подтвердить
                </button>

                <p
                    style={{
                        marginTop: '11.5px', // Увеличено на 15%
                        fontSize: '11.5px', // Увеличено на 15%
                        color: '#777',
                        textAlign: 'center',
                        lineHeight: '1.38', // Увеличено на 15%
                    }}
                >
                    Нажимая "Подтвердить" Вы соглашаетесь с тем, что Вы сами хозяин своих
                    метаактивов и Вам не нужны никакие человеческие ненадёжные соглашения
                    и договорённости. Код — закон.
                </p>
            </div>

            {/* Вторая рамка */}
            <div
                style={{
                    backgroundColor: '#000',
                    border: '0.575px solid #555', // Увеличено на 15%
                    marginTop: '23px', // Увеличено на 15%
                    padding: '11.5px', // Увеличено на 15%
                    borderRadius: '0px',
                    textAlign: 'center',
                    width: '253px', // Увеличено на 15%
                    boxSizing: 'border-box',
                    boxShadow: '0px 0px 11.5px rgba(0,0,0,0.3)', // Увеличено на 15%
                }}
            >
                <p
                    style={{
                        margin: '0 0 11.5px', // Увеличено на 15%
                        fontSize: '13.8px', // Увеличено на 15%
                        color: '#aaa',
                    }}
                >
                    Вход для ИИ
                </p>
                <button
                    style={{
							width: "70%",
							height: '28.19px',
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'pointer',
							boxSizing: 'border-box',
							backgroundColor: isPressed ? 'blue' : '#626300', // Изменение цвета фона при нажатии
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: isPressed ? 'inset' : 'outset', // Изменение стиля границы
							borderColor: 'buttonborder',
							borderImage: 'initial',
							color: '#aaa',
							//letterSpacing: '0.410em',
                    }}
                    disabled
                >
                    Функция в разработке
                </button>
            </div>

            {/* Третья рамка */}
            <div
                style={{
                    backgroundColor: '#000',
                    border: '0.575px solid #444', // Увеличено на 15%
                    marginTop: '23px', // Увеличено на 15%
                    padding: '11.5px', // Увеличено на 15%
                    borderRadius: '0px',
                    textAlign: 'center',
                    width: '253px', // Увеличено на 15%
                    boxSizing: 'border-box',
                    boxShadow: '0px 0px 11.5px rgba(0,0,0,0.3)', // Увеличено на 15%
                }}
            >
                <p
                    style={{
                        margin: '0 0 5.75px', // Увеличено на 15%
                        fontSize: '13.8px', // Увеличено на 15%
                        color: '#bbb',
                    }}
                >
                    Ссылки на другие интерфейсы для подключения:
                </p>
                <p
                    style={{
                        margin: '0',
                        fontSize: '12.65px', // Увеличено на 15%
                        color: '#777',
                    }}
                >
                    Список пока пуст
					<br />
					 
                </p>
				
            </div>
<p
    style={{
        margin: '0',
        fontSize: '9.65px', // Увеличено на 15%
        color: '#777',
        textAlign: 'center', // Выравнивание по центру
    }}
>
<br />
    <a
        href="https://telegra.ph/Manta-sepolia-testnet-info-12-27"
        target="_blank"
        rel="noopener noreferrer"
        style={{
            color: '#00f', // Цвет ссылки
            textDecoration: 'underline', // Подчеркивание
            fontSize: '9.65px', // Размер шрифта соответствует остальному тексту
        }}
    >
        Как пополнить баланс в Manta Pacific Testnet

    </a>
			    <br /> <br />
    Версия 2412280221
    <br />
</p>


        </div>
    );
}




















//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
return (


    <div
        className="App"
		
		
		
		
		
		
		
        onClick={() => {
            if (!buttonActionRef.current) {
                setAction("getCell");
            }
            buttonActionRef.current = false;
				}}// Сбрасываем действие при клике вне кнопки
				style = {
					{
						width: "100vw",
						height: "100vh",
						position: "relative",
						backgroundColor: "#000",
					}
				} > {
					< div > < div style = {
						{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    //cursor: "pointer",
    width: "310px",
    margin: '0 auto', // Центрирование по ширине

   
						}
					} >
					

				   {/* Вставьте этот блок прямо перед основным JSX */}
{logBigErrorMessage && (
    <div
        style={{
            position: 'fixed',
            top: '280px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'red',
            fontSize: '40px', // Размер шрифта
            fontWeight: 'bold',
            textShadow: `
                0px -0px 0 black, 
                0px 0px 0 black, 
                0px 0px 0 black, 
                2px 2px 0 black
            `,
            zIndex: 1000, // Поверх всех элементов
            textAlign: 'center',
            whiteSpace: 'nowrap', // Запрещаем перенос текста
            maxWidth: '100%', // Устанавливаем ширину в пределах экрана
            overflow: 'hidden', // Прячем лишний текст, если он выходит за пределы
        }}
    >
        {logBigErrorMessage}
    </div>
)}










<>

{/* Popup для pendingRecord */}
            {pendingRecord && pendingRecord > 0 && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 999,
                        }}
                    ></div>
                    <div
                        style={{
                            position: "fixed",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#363636",
                            padding: "20px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            zIndex: 1000,
                            width: "240px",
                            border: "1px solid #808080",
                            //borderRadius: "8px",
                        }}
                    >
					
					      <button
        onClick={handleLater}
        style={{
          width: "100%",
          height: "28.19px",
          backgroundColor: "#767999", // Adjust button color
          color: "white", // Adjust button text color
          cursor: "pointer",
          marginTop: "10px", // Add some margin below the button
        }}
      >
        Close
      </button>
					
					
					
                        <h3 style={{ textAlign: "center", color: "#ccc" }}>
                            Ура! Вы поставили новый рекорд 🏆! Ваш адрес кошелька уже сохранён в летописи 📜. Вы также можете оставить послание потомкам:
                        </h3>
                        <input
                            type="text"
                            placeholder="Введите имя или ник"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                marginBottom: "10px",
                                //borderRadius: "4px",
                                border: "1px solid #444",
                                backgroundColor: "#222",
                                color: "#fff",
                            }}
                        />
                        <textarea
                            placeholder="Введите текст"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                marginBottom: "10px",
                                //borderRadius: "4px",
                                border: "1px solid #444",
                                backgroundColor: "#222",
                                color: "#fff",
                                resize: "none",
                                height: "80px",
                            }}
                        />
                        <button
                            onClick={handleSubmit}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                //borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Отправить
                        </button>
                        <button
                            onClick={handleLater}
                            style={{
                                width: "48%",
                                padding: "10px",
                                marginRight: "4%",
                                backgroundColor: "#767999",
                                color: "#fff",
                                border: "none",
                                //borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Позже
                        </button>
                        <button
                            onClick={handleNever}
                            style={{
                                width: "48%",
                                padding: "10px",
                                backgroundColor: "#d9534f",
                                color: "#fff",
                                border: "none",
                                //borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Никогда
                        </button>
                    </div>
                </>
            )}


</>















<>

{isModalOpen && (
    <>
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
            }}
            onClick={closeModal}
        ></div>
        <div
            style={{
                position: "fixed",
                left: "50%",
				top: "40px",
                transform: "translate(-50%, 0%)",
                backgroundColor: "gray",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                width: "220px", // Ширина окна
                maxHeight: "450px", 
                overflowY: "auto",
				border: "1px solid #808080",
            }}
        >            <button
                onClick={closeModal}
                style={{
							width: "100%",
							height: '28.19px',
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'pointer',
							boxSizing: 'border-box',
							backgroundColor: isPressed ? 'blue' : '#767999', // Изменение цвета фона при нажатии
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: isPressed ? 'inset' : 'outset', // Изменение стиля границы
							borderColor: 'buttonborder',
							borderImage: 'initial',
							color: 'white',
							//letterSpacing: '0.410em',
                }}
            >
                Close
            </button>
            <h3 style={{ textAlign: "center", marginBottom: "10px"}}>Top 100 Players</h3>
            <div>
                {topPlayers.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#ccc" }}>Loading...</p>
                ) : (
                    topPlayers.map((player, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                margin: "10px 0", 
                                borderBottom: "1px solid lightgray", 
                                paddingBottom: "10px" 
                            }}
                        >
<div><strong>{player.rank}</strong></div>
<div><strong>Score:</strong> {player.score}</div>
<div>
  <strong>Address: </strong> 
  <a 
    href={`https://pacific-explorer.sepolia-testnet.manta.network/address/${player.address}`} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    {`${player.address.slice(0, 6)}...${player.address.slice(-4)}`}
  </a>
</div>
<div><strong>Name:</strong> {player.name}</div>

	 {/*
<div><strong>Best Score:</strong> {player.bestScore}</div>
	 */}
	  {/*
<div>
    <strong>First Game:</strong>{" "}
    {typeof player.firstGameTimestamp === "string"
        ? player.firstGameTimestamp // Уже отформатированное значение
        : new Date(player.firstGameTimestamp * 1000).toLocaleString()}
</div>
*/}
<div>
    <strong>Link:</strong>{" "}
                                <a
                                    href={
                                        player.link.startsWith("http://") || player.link.startsWith("https://")
                                            ? player.link
                                            : `https://${player.link}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "blue", textDecoration: "underline" }}
                                >
                                    {player.link}
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button
                onClick={closeModal}
                style={{
							width: "100%",
							height: '28.19px',
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'pointer',
							boxSizing: 'border-box',
							backgroundColor: isPressed ? 'blue' : '#767999', // Изменение цвета фона при нажатии
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: isPressed ? 'inset' : 'outset', // Изменение стиля границы
							borderColor: 'buttonborder',
							borderImage: 'initial',
							color: 'white',
							//letterSpacing: '0.410em',
                }}
            >
                Close
            </button>
        </div>
    </>
)}


</>
			
<>			
			
{isChronicleOpen && (
    <>
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
            }}
            onClick={closeChronicle}
        ></div>
        <div
      style={{
                position: "fixed",
                left: "50%",
				top: "40px",
                transform: "translate(-50%, 0%)",
                backgroundColor: "gray",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                width: "220px", // Ширина окна
                maxHeight: "450px", 
                overflowY: "auto", 
				border: "1px solid #808080",
      }}
    >
      <button
        onClick={closeChronicle}
        style={{
          width: "100%",
          height: "28.19px",
          backgroundColor: "#767999", // Adjust button color
          color: "white", // Adjust button text color
          cursor: "pointer",
          marginBottom: "10px", // Add some margin below the button
        }}
      >
        Close
      </button>
<h3 style={{ textAlign: "center" }}>Летопись</h3>
<div>
    {allChronicles.length === 0 ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
    ) : (
<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}> {/* Убираем отступы и маркеры у списка */}
    {allChronicles.map((chronicle, index) => (
        <li 
            key={index} 
            style={{ 
                borderBottom: "1px solid lightgray", 
                marginBottom: "5px", // Уменьшенные отступы
                paddingBottom: "5px", // Уменьшенные отступы
                paddingTop: "5px", // Уменьшенные отступы сверху
                listStyleType: "none" // Убираем маркеры у элементов списка
            }}
        >
{chronicle.chronicle.id && (
    <p style={{ margin: "0px 0"}}>
        <strong style={{ marginLeft: "0px" }}>🪶{chronicle.chronicle.id}</strong>
    </p>
)}


            {chronicle.chronicle.recordAddress && (
                <p style={{ margin: "0px 0" }}>
                    <strong></strong> 
                    <a 
                        href={`https://pacific-explorer.sepolia-testnet.manta.network/address/${chronicle.chronicle.recordAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        {`${chronicle.chronicle.recordAddress.slice(0, 6)}...${chronicle.chronicle.recordAddress.slice(-4)}`}
                    </a>
                </p>
            )}
			{chronicle.chronicle.recordScore && <p style={{ margin: "0px 0", color: "#793e7a" }}><strong></strong> {chronicle.chronicle.recordScore}</p>} 
            <p style={{ margin: "0px 0" }}><strong></strong> {chronicle.chronicle.recordName}</p> 
            
            {chronicle.chronicle.recordMessage && <p style={{ margin: "0px 0" }}><strong></strong> {chronicle.chronicle.recordMessage}</p>} 
            {chronicle.chronicle.recordTime && <p style={{ margin: "0px 0", color: "#555" }}><strong></strong> {chronicle.chronicle.recordTime}</p>} 
            {/* ... и так далее для всех полей */}
        </li>
    ))}
</ul>

    )}
</div>
      <button
        onClick={closeChronicle}
        style={{
          width: "100%",
          height: "28.19px",
          backgroundColor: "#767999", // Adjust button color
          color: "white", // Adjust button text color
          cursor: "pointer",
          marginTop: "10px", // Add some margin below the button
        }}
      >
        Close
      </button>
    </div>
  </>
)}			
			










</>


<>



{isSchoolOpen && (
    <>
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
            }}
            onClick={closeSchool}
        ></div>
        <div
            style={{
                position: "fixed",
                left: "50%",
				top: "40px",
                transform: "translate(-50%, 0%)",
                backgroundColor: "#363636",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                width: "220px", // Ширина окна
                maxHeight: "450px", 
                overflowY: "auto", 
				border: "1px solid #808080",
                
            }}
        >
            <button
                onClick={closeSchool}
                style={{
                    width: "100%",
                    height: "30px",
                    backgroundColor: "#767999",
                    color: "white",
                    cursor: "pointer",
                    marginBottom: "10px",
                }}
            >
                Close
            </button>
            <h3 style={{ textAlign: "center", color: "#ccc" }}>Обучение</h3>
            <div style={{ fontSize: "14px", color: "#ccc" }}>
                <p>⦁ Вернуться к обучению вы всегда сможете по кнопке 🎓.</p>
                <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                    <li>⦁ Найдите астероид - кнопка 🔭.</li><br />
                    <li>⦁ Начните добывать ⛏️ с тёмных и светлых клеток железо (i) и уголь (c).</li><br />
                    <li>⦁ Поставьте печь 🔥 и с помощью манипуляторов ⬇️➡️ и ящиков 📦 доставьте в неё ⛏️➡️🔥 уголь и железо для производства шестерёнок ⚙️.</li><br />
                    <li>⦁ Манипуляторы не могут брать из других манипуляторов. Так: ➡️➡️ не сработает.</li><br />
                    <li>⦁ 🏗️ - Застраивать повреждённые метеоритами клетки.</li><br />
                    <li>⦁ Ставьте заводы 🏭 и настраивайте 🧩 их на нужное производство.</li><br />
                    <li>⦁ ❌ - Убрать постройку.</li><br />
                    <li>⦁ Стена 🧱 выдерживает 8-9 ударов метеоритов. Можно ставить поверх текущих стен. </li><br />
                    <li>⦁ ⏸️ Пауза (да-да, пауза в блокчейне).</li><br />
                    <li>⦁ 1x - Регулировать скорость игры.</li><br />
                
               
                    <li>
					⦁ Когда будешь готов жми 🚀 - и если пролетишь достаточно далеко - попадёшь в топ 100 🏆, а если  дальше всех и станешь топ 1 - сможешь оставить нестираемую запись в летопись 📜 для потомков - будущих покорителей метавселенных.Историю пишут победители.  
					</li>
                <h4>&nbsp;&nbsp;&nbsp;Остальные кнопки:</h4>
                
                    <li>⦁ Пустая кнопка - отжимает другие кнопки (клавиша <strong>q</strong>).</li>
					<li>
					⦁ 🔄 - Автосинхронизация.  
					</li>
					<li>
					⦁ 🔂 - Один шаг синхронизации.  
					</li>
					<li>
					⦁ 📘 - Это вам не надо, это мне.  
					</li>
					<li>
					⦁ 📄 - BlockExplorer.  
					</li>
					<li>
					⦁ 👤 - Обновить имя.  
					</li>
					<li>
					⦁ 🌐 - Обновить ссылку.  
					</li>
					<li>
					⦁ 👥 - Чатик.  
					</li>
					<li>
					⦁ 🏛️ - DAO (Функция в разработке).  
					</li>
					<li>
					⦁ Вроде всё. Удачи!
					</li>
                </ul>
            </div>
            <button
                onClick={closeSchool}
                style={{
                    width: "100%",
                    height: "30px",
                    backgroundColor: "#767999",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "10px",
                }}
            >
                Close
            </button>
        </div>
    </>
)}




</>




            {/* Остальная часть компонента */}
					
					
					
					< button
					onMouseDown = {
						() => {
							setIsPressed(true);
							setAction("getCell");
						}
					} // При нажатии
					onMouseUp = {
						() => setIsPressed(false)
					} // При отпускании
					onMouseLeave = {
						() => setIsPressed(false)
					} // Если курсор уходит с кнопки
					onClick = {
						(e) => {
							e.stopPropagation();
							// Эта кнопка нужна чтоб отжимать другие кнопки ))
						}
					}
					style = {
						{
							width: '43.05px',
height: '28.19px',
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'pointer',
							boxSizing: 'border-box',
							backgroundColor: isPressed ? 'blue' : '#767999', // Изменение цвета фона при нажатии
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: isPressed ? 'inset' : 'outset', // Изменение стиля границы
							borderColor: 'buttonborder',
							borderImage: 'initial',
							color: 'white',
							letterSpacing: '0.410em',
						}
					} title="Эта кнопка отжимает другие кнопки(q)."
					>&nbsp;&nbsp;< /button>
					
<button
    onClick={async (e) => {
        e.stopPropagation(); // Останавливаем всплытие

		setIsSchoolOpen(true);
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: isSchoolOpen ? 'blue' : '#767999',
		borderStyle: isSchoolOpen ? 'inset' : 'outset',
        cursor: "pointer"
    }}
    title="Летопись"
>
    🎓
</button>	
					
					< button
					onClick = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие события
							if (window.confirm("Подтверждение на поиск нового астероида. Текущий, если он есть, будет потерян в просторах космоса навсегда.")) {
								executeAction("initializeGrid");
							}
						}
					}
					style = {
						{
		width: '43.05px',
height: '28.19px',
							backgroundColor: getButtonColor("initializeGrid"),
							cursor: "pointer"
						}
					} title="Начать новый астероид."> 🔭 < /button> 



					
< button
    onClick={(e) => {
        e.stopPropagation(); // Останавливаем всплытие события
        if (window.confirm("Подтверждение на запуск. Оттуда ещё никто не возвращался..")) {
            setGotoLevel();
        }
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        borderStyle: gotoGameLevel === 110 ? "inset" : "outset", // Если пауза не активна
        backgroundColor: gotoGameLevel === 110 ? "blue" : "#767999", // Если пауза активна
        cursor: "pointer",
    }}
    title="Poehali!"
>
    🚀
</button>
				
					
					

< button
    onClick={(e) => {
        e.stopPropagation(); // Останавливаем всплытие события
        togglePause();
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        borderStyle: isGamePaused === 0 ? "outset" : "inset", // Меняем стиль в зависимости от состояния
        backgroundColor: isGamePaused === 0 ? "#767999" : "blue", // Меняем цвет в зависимости от состояния
        cursor: "pointer",
    }}
    title={isGamePaused === 0 ? "Снять паузу." : "Да-да, пауза в блокчейне."}
>
    {isGamePaused === 0 ? "⏸️" : "⏸️"} {/* Меняем текст в зависимости от состояния */}
</button>

        <button
            onClick={() => {
                setIsToggled(!isToggled); // Переключение состояния
            }}
            style={{
                width: '43.05px',
                height: '28.19px',
                backgroundColor: isToggled ? 'blue' : '#767999', // Меняет цвет при переключении
                cursor: "pointer",
				 borderStyle: isToggled ? "inset" : "outset", // Если пауза не активна
            }}
            title="Синхронизация"
        >
            {isToggled ? "🔄" : "🔄"} {/* Меняет иконку при переключении */}
        </button>		





					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "removeTool") {
								setAction("getCell");
							}
							else {
								setAction("removeTool");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('removeTool'),
							backgroundColor: getButtonColor("removeTool"),
							cursor: "pointer"
						}
					} title="Удалить строение"> ❌ < /button>










<button
    onMouseDown={(e) => {
        e.stopPropagation(); // Останавливаем всплытие клика к родителю
        buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

        if (action === "placeDrill") {
            setAction("getCell");
        } else {
            setAction("placeDrill");
        }
    }}
    style={{
		width: '43.05px',
height: '28.19px',
        borderStyle: getButtonborderStyle('placeDrill'),
        backgroundColor: getButtonColor("placeDrill"),
        cursor: "pointer",
    }}
    title="Разместить добытчик руды." // Добавляем атрибут title
>
    ⛏️
</button>







					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeFurnace") {
								setAction("getCell");
							}
							else {
								setAction("placeFurnace");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeFurnace'),
							backgroundColor: getButtonColor("placeFurnace"),
							cursor: "pointer"
						}
					} title="Разместить печь."> 🔥 < /button>














					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeManUD") {
								setAction("getCell");
							}
							else {
								setAction("placeManUD");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeManUD'),
							backgroundColor: getButtonColor("placeManUD"),
							cursor: "pointer"
						}
					} title="Разместить манипулятор"> ⬇️ < /button>



					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeManLR") {
								setAction("getCell");
							}
							else {
								setAction("placeManLR");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeManLR'),
							backgroundColor: getButtonColor("placeManLR"),
							cursor: "pointer"
						}
					} title="Манипулятор"> ➡️ < /button>



					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeManRL") {
								setAction("getCell");
							}
							else {
								setAction("placeManRL");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeManRL'),
							backgroundColor: getButtonColor("placeManRL"),
							cursor: "pointer"
						}
					} title="Манипулятор"> ⬅️ < /button>



					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeManDU") {
								setAction("getCell");
							}
							else {
								setAction("placeManDU");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeManDU'),
							backgroundColor: getButtonColor("placeManDU"),
							cursor: "pointer"
						}
					} title="Манипулятор"> ⬆️ < /button>


					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeFactory") {
								setAction("getCell");
							}
							else {
								setAction("placeFactory");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeFactory'),
							backgroundColor: getButtonColor("placeFactory"),
							cursor: "pointer"
						}
					} title="Разместить завод."> 🏭 < /button>

					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeBulldozer") {
								setAction("getCell");
							}
							else {
								setAction("placeBulldozer");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeBulldozer'),
							backgroundColor: getButtonColor("placeBulldozer"),
							cursor: "pointer"
						}
					} title="Застроить повреждённые клетки"> 🏗️ < /button>

					< button
					onMouseDown = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие клика к родителю
							 buttonActionRef.current = true; // Устанавливаем флаг, что кнопка была нажата

							if (action === "placeBox") {
								setAction("getCell");
							}
							else {
								setAction("placeBox");
							}
						}
					}
					style = {
						{
								
		width: '43.05px',
height: '28.19px',					
							borderStyle: getButtonborderStyle('placeBox'),
							backgroundColor: getButtonColor("placeBox"),
							cursor: "pointer"
						}
					} title="Разместить ящик"> 📦 < /button>


<button
    onMouseDown={(e) => {
        e.stopPropagation();
        buttonActionRef.current = true;

        if (action === "placeWall") {
            setAction("getCell");
        } else {
            setAction("placeWall");
        }
    }}
    style={{
		width: '43.05px',
height: '28.19px',
        borderStyle: getButtonborderStyle('placeWall'),
        backgroundColor: getButtonColor("placeWall"),
        cursor: "pointer",
    }}
    title="Разместить стену."
>
    🧱
</button>
					< select
					onChange = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие события
							setAction(e.target.value); // Устанавливаем новое действие
						}
					}
					onClick = {
						(e) => e.stopPropagation()
					} // Предотвращаем всплытие клика
					value = {
						action
					}
					style = {
						{
							textRendering: 'auto',
							color: 'buttontext',
							letterSpacing: 'normal',
							wordSpacing: 'normal',
							lineHeight: 'normal',
							textTransform: 'none',
							textIndent: '0px',
							textShadow: 'none',
							display: 'inline-block',
							textAlign: 'center',
							alignItems: 'flex-start',
							cursor: 'default',
							boxSizing: 'border-box',
							backgroundColor: '#767999',
							margin: '0em',
							paddingBlock: '1px',
							paddingInline: '6px',
							borderWidth: '2px',
							borderStyle: 'outset',
							borderColor: 'buttonborder',
							borderImage: 'initial',
							margin: '0px',
							cursor: "pointer",
							textAlign: 'left',
							paddingInline: '2px',
							textIndent: '0px',
							margin: '0px',
							width: '6.7em',
							paddingRight: '0px',
paddingTop: '3px',
		width: '43.05px',
height: '28.19px',
						}
					} title="Настройка завода"> < option value = "" > 🧩🏭→❔ < /option> <
					option value = "componentsF" > ⚙️10→🧩 < /option> <
					option value = "drillsF" > 🧩10→⛏️ < /option> <
					option value = "boxesF" > 🧩10→📦 < /option> <
					option value = "mansF" > 🧩10→↔️ < /option> <
					option value = "furnaceF" > 🧩10→🔥 < /option> <
					option value = "factoryF" > 🧩10→🏭 < /option> <
					option value = "bulldozerF" > 🧩100→🏗️ < /option> <
					option value = "wallF" > ⚙️1к+🧩50+🔥5→🧱2 < /option> <


					/
					select > 





<select
    onChange={(e) => {
        e.stopPropagation(); // Останавливаем всплытие события
        const speed = e.target.value;
        handleSpeedChange(speed); // Обновляем состояние через handleSpeedChange
    }}
    onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие клика
    value={selectedSpeed} // Привязка текущего значения из состояния
    style={{
        textRendering: 'auto',
        color: 'buttontext',
        letterSpacing: 'normal',
        wordSpacing: 'normal',
        lineHeight: 'normal',
        textTransform: 'none',
        textIndent: '0px',
        textShadow: 'none',
        display: 'inline-block',
        textAlign: 'center',
        alignItems: 'flex-start',
        cursor: 'default',
        boxSizing: 'border-box',
        backgroundColor: '#767999',
        margin: '0em',
        paddingBlock: '1px',
        paddingInline: '6px',
        borderWidth: '2px',
        borderStyle: 'outset',
        borderColor: 'buttonborder',
        borderImage: 'initial',
        cursor: "pointer",
       textAlign: 'left',
        paddingInline: '0px',
        margin: '0px',
       // width: '6.7em',
        width: '43.05px',
        height: '28.19px',
		 fontSize: '10px',
									paddingRight: '1px',
paddingTop: '5px',
    }}
    title="Скорость игры"
>
    <option value="?x">?x</option> {/* Опция для начального значения */}
    <option value="1x">1x</option>
    <option value="2x">2x</option>
    <option value="3x">3x</option>
    <option value="5x">5x</option>
    <option value="7x">7x</option>
    <option value="10x">10x</option>
    <option value="15x">15x</option>
    <option value="20x">20x</option>
    <option value="25x">25x</option>	
    <option value="50x">50x</option>	
	
	
</select>




{/*

 < button
					onClick = {
						(e) => {
							e.stopPropagation(); // Останавливаем всплытие
							executeAction("starttimeeUpdate"); // Вызываем функцию
						}
					}
					style = {
						{
		width: '43.05px',
height: '28.19px',
							backgroundColor: getButtonColor("starttimeeUpdate"),
							cursor: "pointer"
						}
					} title="Криосон"> 🛌 < /button>


					*/}
					
					
					
					
					
					
					< button
					
					ref={updateCoalButtonRef} 
					onClick = {
						(e) => {
							e.stopPropagation();
							updateCoal();
						}
					}
					style = {
						{
		width: '43.05px',
height: '28.19px',
							backgroundColor: getButtonColor("updateCoal"), // Цвет кнопки
							cursor: "pointer"
						}
					} title="Один шаг синхронизации"> 🔂 < /button>

					{/*}

					< button
					onClick = {
						(e) => {
							e.stopPropagation();
							executeAction("meteoritfunction"); // Вызываем действие напрямую
						}
					}
					style = {
						{
							backgroundColor: getButtonColor("meteoritfunction"), // Цвет кнопки
							cursor: "pointer"
						}
					} title="Для отладки, я б не нажимал."> ☄️ < /button>

{*/}

	{/*}
					< button
					onClick = {
						(e) => {
							e.stopPropagation();
							executeAction("fetchGrid"); // Вызываем действие напрямую
						}
					}
					style = {
						{
		width: '43.05px',
height: '28.19px',
							backgroundColor: getButtonColor("fetchGrid"), // Цвет кнопки
							cursor: "pointer"
						}
					} title="Для отладки, я б не нажимал."> 🗺️ < /button>

					{*/}
					< button
					onClick = {
						(e) => {
							e.stopPropagation();
							executeAction("getDepot"); // Вызываем действие напрямую
						}
					}
					style = {
						{
		width: '43.05px',
height: '28.19px',
							backgroundColor: getButtonColor("getDepot"), // Цвет кнопки
							cursor: "pointer"
						}
					} title="Нажми F12"> 📘 < /button> 





<button
    onClick={async () => {
        try {
			const signer = getSigner();
            const userAddress = await signer.getAddress(); // Получение адреса
            const explorerUrl = `https://pacific-explorer.sepolia-testnet.manta.network/address/${userAddress}`;
            window.open(explorerUrl, "_blank"); // Открытие в новой вкладке
        } catch (error) {
            console.error("Ошибка при получении адреса пользователя:", error);
        }
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: '#767999', // Можно заменить на любой цвет
        cursor: "pointer"
    }}
    title="BlockExplorer"
>
    📄
</button>

<button
    onClick={(e) => {
        e.stopPropagation(); // Останавливаем всплытие
        executeAction("updatePlayerName"); // Вызываем функцию для обновления имени
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: getButtonColor("updatePlayerName"),
        cursor: "pointer"
    }}
    title="Обновить имя"
>
    👤
</button>

<button
    onClick={(e) => {
        e.stopPropagation(); // Останавливаем всплытие
        executeAction("updatePlayerLink"); // Вызываем функцию для обновления ссылки
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: getButtonColor("updatePlayerLink"),
        cursor: "pointer"
    }}
    title="Обновить ссылку"
>
    🌐
</button>
					
					
<button
    onClick={() => {
        window.open("https://t.me/metagameonchain", "_blank");
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: '#767999', // Можно заменить на любой цвет
        cursor: "pointer"
    }}
    title="Чатик"
>
    👥
</button>
					

					
			
			{/*					
					
<button
    onClick={() => {
       // window.open("https://t.me/metagameonchain", "_blank");
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: '#767999', // Можно заменить на любой цвет
        cursor: "pointer"
    }}
    title="DAO (Функция в разработке)"
>
    🏛️
</button>					
		
			*/}
		
		
		
					
<button
    onClick={(e) => {
        e.stopPropagation(); // Останавливаем всплытие
       openModal();
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: getButtonColor("updatePlayerLink"),
        cursor: "pointer"
    }}
    title="Топ 100"
>
    🏆
</button>					
		
<button
    onClick={async (e) => {
        e.stopPropagation(); // Останавливаем всплытие
		const chain = await fetchContractsChain();
        await getAllChronicles(chain);
		setIsChronicleOpen(true);
    }}
    style={{
        width: '43.05px',
        height: '28.19px',
        backgroundColor: getButtonColor("updatePlayerLink"),
        cursor: "pointer"
    }}
    title="Летопись"
>
    📜
</button>						
					

					
					
					
					< /div>





					< p
					style = {
						{
display: 'flex', // Используем flexbox для выравнивания
justifyContent: 'space-between', // Центрируем содержимое по горизонтали
width: '305px', // Ширина контейнера
alignItems: 'center', // Выравнивание по вертикали (если нужно)
margin: '0 auto', // Центрируем контейнер по ширине
color: '#bcbf00', // Устанавливаем цвет текста
fontWeight: 'bold', // Дополнительно делаем текст жирным (опционально)
fontSize: '17px', // Размер шрифта

						}
					} >     <span>{formattedDensity} метеорит/сек </span>
    <span>путь {calculatedDistance} км </span>
					 < /p>  < > {
					grid && grid.length > 0 && ( < div style = {
							{
								display: 'flex', // Используем flexbox для выравнивания
								justifyContent: 'center', // Центрируем по горизонтали
								width: '100vw', // Ширина контейнера на весь экран
								//height: '100vh', // Высота контейнера на весь экран
								    gap: '0', // Убираем зазор между клетками
    margin: '0',
    padding: '0',
								//marginTop: '2.5px',
								alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
								marginTop: '3px',
							}
						} >< div style = {
							{
								display: 'grid',
								gridTemplateColumns: `repeat(${grid.length}, 30px)`,
								gap: '0px',
							}
						} > {
							grid[0].map((_, colIndex) => (grid.map((_, rowIndex) => {
											const cell = grid[rowIndex][grid[0].length - 1 - colIndex];
											return ( < div key = {
													`${rowIndex}-${colIndex}`
												}
												style = {
													{
														
														width: '30px',
														height: '30px',

		backgroundColor: cell.tool === "Ruins" ? '#290000' : cell.tool === "Space" ? '#000' : cell.content === "contentEmpty" ? '#127852' : cell.tool === "Ruins" ? '#290000' : cell.content === "Iron" ? 'silver' : cell.content === "Coal" ? '#474747' : cell.content === "Update" ? '#035a66' : cell.content === "Null" ? '#035a66' : '#121212',
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														cursor: 'pointer',
														border: selectedCell2 && selectedCell2.x === cell.x && selectedCell2.y === cell.y ? '2px solid blue' : '0.2px solid #000',
														boxSizing: 'border-box',
														fontSize: '16px',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														textAlign: 'center',
														whiteSpace: 'normal', // Разрешаем перенос текста
														flexDirection: 'column', // Элементы будут располагаться вертикально
	
														
													}
												}
								/*				
className={
  cell.tool === "Space"
    ? "toolSpace"
    : cell.content === "contentEmpty"
    ? "contentEmpty"
    : cell.tool === "Ruins"
    ? "Ruins"
    : cell.content === "Iron"
    ? "Iron"
    : cell.content === "Coal"
    ? "Coal"
    : cell.content === "Update" || cell.content === "Null"
    ? "Update"
    : "default"
}
*/


												onClick = {
													(e) => {
														e.stopPropagation(); // Останавливаем всплытие события
														handleCellClick(cell);
													}
												}
												onMouseDown = {
													(e) => {
														e.stopPropagation(); // Останавливаем всплытие события
														handleCellClick2(cell);
													}
												}
												onMouseUp = {
													(e) => {
														e.stopPropagation(); // Останавливаем всплытие события
														handleCellClick2(null);
													}
												} > 
												   
    {/* Остальной код */}
												
												{
													activeCells.includes(`${cell.x}-${cell.y}`) && ( < div style = {
															{
position: 'absolute',
width: '20px',
height: '20px',
animation: 'signalPulse 1s infinite',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
fontSize: '20px',
//color: 'rgba(255, 255, 255, 1)', // Текст с 50% прозрачности
//backgroundColor: 'rgba(0, 0, 0, 0.5)', // Фон с 50% прозрачности
															}
														} > 📡 < /div>)
													} {
														(cell.tool === "Space" || cell.tool === "Ruins" || cell.tool === "Box" || cell.tool === "Wall" || cell.tool === "Drill" || cell.tool === "Furnace" || cell.tool === "Factory" || ["LR", "RL", "UD", "DU"].includes(cell.man)) && ( < div style = {
																{
																	display: 'flex',
																	flexDirection: 'column',
																	justifyContent: 'center',
																	alignItems: 'center',
																	width: '100%',
																	height: '100%',
																	textAlign: 'center',
																}
															} > {
																cell.tool === "Space" && ""
															} {
																cell.tool === "Ruins" && ""
															} {
																cell.tool === "Box" && "📦"
															} {
																cell.tool === "Drill" && "⛏️"
															} {
																cell.tool === "Furnace" && "🔥"
															} {
																cell.tool === "Factory" && "🏭"
															} {
																cell.tool === "Wall" && "🧱"
															} {
																cell.tool === "Update" && "📶"
															} {
																cell.man === "LR" && "➡️"
															} {
																cell.man === "RL" && "⬅️"
															} {
																cell.man === "UD" && "⬇️"
															} {
																cell.man === "DU" && "⬆️"
															} {
																//activeCells.includes(`${cell.x}-${cell.y}`) && setActiveCells((prev) => prev.filter((id) => id !== `${cell.x}-${cell.y}`))
															} < /div>)
														} 
														

															
															

{
    cell.factorySettings == "drillsF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            ⛏️
        </span>
    )
}

			

{
    cell.factorySettings == "boxesF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            📦
        </span>
    )
}

			

{
    cell.factorySettings == "mansF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            ↔️
        </span>
    )
}

			

{
    cell.factorySettings == "furnaceF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            🔥
        </span>
    )
}

			

{
    cell.factorySettings == "factoryF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            🏭
        </span>
    )
}

			

{
    cell.factorySettings == "bulldozerF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            🏗️
        </span>
    )
}

			

{
    cell.factorySettings == "componentsF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            🧩
        </span>
    )
}

			
{
    cell.factorySettings == "wallF" && (
        <span
            style={{
                position: 'absolute', // Абсолютное позиционирование
                transform: 'translate(-8px, -8px)', // Смещение в верхний левый угол
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8, // Прозрачность 50%
            }}
        >
            🧱
        </span>
    )
}




															
															
															
															
															
															
															
															
															
															
															
															
															{
																cell.componentsAmount > 0 && ( < span style = {
																		{
																				position: 'absolute',
																				 transform: 'translate(-0px, +9px)',
																				 //opacity: 0.65, // Прозрачность 50%
																			fontSize: '6px',
																			fontFamily: 'Arial, sans-serif',
																			fontWeight: 'bold',
																			display: 'block'
																		}
																	} > {
																		` 🧩:${cell.componentsAmount}`
																	} < /span>)
																}






																{
																	cell.ironAmount > 0 && ( < span style = {
																			{
																				position: 'absolute',
																				 transform: 'translate(-0px, -9px)',
																				// opacity: 0.65, // Прозрачность 50%
																				fontSize: '6px',
																				fontFamily: 'Arial, sans-serif',
																				fontWeight: 'bold',
																				display: 'block'
																			}
																		} > {
																			` i:${cell.ironAmount}`
																		} < /span>)
																	} 
																	
																	
																	
																	
																	{																				cell.ironplateAmount > 0 && ( < span style = {
																				{
																				position: 'absolute',
																				 transform: 'translate(-0px, -0px)',
																				// opacity: 0.65, // Прозрачность 50%
																					fontSize: '6px',
																					fontFamily: 'Arial, sans-serif',
																					fontWeight: 'bold',
																					display: 'block'
																				}
																			} > {
																				` ⚙️:${cell.ironplateAmount}`
																			} < /span>)
																	} 		
																		
															{
    cell.wallPowerAmount > 0 && (
        <span
            style={{
                color: Math.floor(Number(cell.wallPowerAmount) / 100) < 3 ? "#0400ff" : "black",
                position: 'absolute',
                transform: 'translate(-0px, -0px)',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                display: 'block',
            }}
        >
            {Math.floor(Number(cell.wallPowerAmount) / 100)}
        </span>
    )
}

 																			
														
														{
															cell.coalAmount > 0 && ( < span style = {
																	{
																				position: 'absolute',
																				 transform: 'translate(-0px, +9px)',
																				 //opacity: 0.65, // Прозрачность 50%
																		fontSize: '6px',
																		fontFamily: 'Arial, sans-serif',
																		fontWeight: 'bold',
																		display: 'block'
																	}
																} > {
																	` c:${cell.coalAmount}`
																} < /span>)
															} 																			
																		 < /div>);
																	})))
													} < /div> < /
													div > )
											} < /> 



<p
    style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
        alignItems: 'flex-start',
        margin: '0',
        color: dynamicEarlyValue > 60 ? 'red' : '#bcbf00',
        fontWeight: 'bold',
        fontSize: '17px',
        textAlign: 'center',
        marginTop: '1px',
        animation: dynamicEarlyValue > 60 ? 'blink 1s infinite' : 'none' // Анимация только при условии
    }}
>
    Синхронизация {dynamicEarlyValue * speedkoefState} сек. назад
</p>

<style>
{`
    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }
`}
</style>





											< div style = { {
    width: "300px",
    margin: '0 auto',
												display: 'flex', // Используем flexbox для выравнивания
												justifyContent: 'center', // Центрируем по горизонтали
												//width: '100vw', // Ширина контейнера на весь экран
												//height: '100vh', // Высота контейнера на весь экран
												alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
												//position: 'fixed', // Закрепляет блок относительно окна
												//bottom: '10px', // Отступ от верхнего края
												//right: '40px', // Отступ от правого края
												flexWrap: 'wrap', // Разрешает перенос элементов на новую строку
												gap: '5px', // Уменьшаем отступ между элементами
												color: 'SaddleBrown', // Цвет текста
												//width: '309px', // Ограничиваем ширину
        fontWeight: 'bold', // Дополнительно делаем текст жирным (опционально)
        fontSize: '14px', // Размер шрифта
												lineHeight: '16px', // Межстрочный интервал
												//padding: '5px', // Отступы внутри контейнера
												 marginTop: '3px',
											}
										} > < p style = {
											{
												margin: '0'
											}
										} > ⛏️: {
											depot.drillsAmount
										} < /p> <
										p style = {
											{
												margin: '0'
											}
										} > 📦: {
											depot.boxesAmount
										} < /p> <
										p style = {
											{
												margin: '0'
											}
										} > 🏗️: {
											depot.bulldozerAmount
										} < /p>  <
										p style = {
											{
												margin: '0'
											}
										} > ↔️: {
											depot.mansAmount
										} < /p>

										<
										p style = {
											{
												margin: '0'
											}
										} > 🧱: {
											depot.wallAmount
										} < /p> <
										p style = {
											{
												margin: '0'
											}
										} > 🔥: {
											depot.furnaceAmount
										} < /p> <
										p style = {
											{
												margin: '0'
											}
										} > 🏭: {
											depot.factoryAmount
										} < /p> < /
										div > < div style = {
											{
												//marginleft: "90px", /* Отступ слева */
												//marginright: "90px", /* Отступ справа */
    position: 'absolute',
    left: '50%', // Центрируем по ширине
    transform: 'translateX(-50%)', // Сдвигаем обратно на половину ширины элемента
    color: 'LimeGreen',
    marginTop: "5px",
    padding: "10px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "300px",
    height: "60px",
    border: "1px solid #808080",
    resize: "vertical",
    boxSizing: "border-box"
											}
										}
										ref = {
											logContainerRef
										} > {
											logMessages.map((msg, index) => ( < pre key = {
														index
													}
													style = {
														{
															margin: 0,
															padding: 0,
															color: msg.color
														}
													} > {
														msg.text
													} < /pre>))
												} < /div> < /div >
											} < /div>);
										};
										export default App;