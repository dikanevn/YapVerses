import React, {
	useState,
	useEffect,
	useRef
}
from 'react';
import {
	ethers
}
from 'ethers';
import SimpleGridABI from './SimpleGridABI.json';
document.body.style.backgroundColor = "#121212";
document.body.style.color = "#121212";
const App = () => {
	const [provider, setProvider] = useState(null);
	const [contract, setContract] = useState(null);
	const [grid, setGrid] = useState([]);
	const [depot, setDepot] = useState([]);
	const [loading, setLoading] = useState(false);
	const [action, setAction] = useState(null);
	const [selectedCell, setSelectedCell] = useState(null);
	const [selectedCell2, setSelectedCell2] = useState(null);
	const [logMessages, setLogMessages] = useState([]);
	const defaultPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Ваш тестовый приватный ключ
	const [userPrivateKey, setUserPrivateKey] = useState(defaultPrivateKey);
	const [isKeyConfirmed, setIsKeyConfirmed] = useState(!!defaultPrivateKey); // Подтверждаем, если ключ уже есть


	const [timePassed, setTimePassed] = useState('');
	const [Distance, setDistance] = useState('');
	const contractAddress = "0xa35aC73c31Dd438C5AB2E811433033B1B0D468B3";


	const gasLLimit = 30000000; // Вставьте ваш приватный ключ сюда
	const [logMessage, setLogMessage] = useState(""); // Состояние для хранения лог-сообщения
	const [logErrorMessage, setlogErrorMessage] = useState(""); // Состояние для хранения лог-сообщения
	useEffect(() => {
		// Очистка состояния при обновлении страницы
		setGrid([]);
		setDepot([]);
		setAction(null);
		setSelectedCell(null);

	}, []); // Пустой массив зависимостей означает, что этот код выполнится один раз при монтировании компонента.

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				// Инициализация провайдера
				const prov = new ethers.providers.Web3Provider(window.ethereum);
				// Запрос аккаунтов
				const accounts = await prov.send('eth_requestAccounts', []);
				if (accounts.length === 0) {
					//alert("Нет доступных аккаунтов в MetaMask.");
					return;
				}
				// Инициализация подписанта
				const signer = prov.getSigner();
				// Инициализация контракта
				const contractInstance = new ethers.Contract(contractAddress, SimpleGridABI, signer);
				// Сохранение провайдера и контракта в состоянии
				setProvider(prov);
				setContract(contractInstance);
				console.log('Wallet connected:', accounts[0]); // Вывод активного аккаунта
				console.log('Contract instance:', contractInstance);
			}
			catch (error) {
				console.error("Ошибка подключения кошелька:", error);
				//alert("Ошибка подключения кошелька. Проверьте MetaMask.");
			}
		}
		else {
			//alert("Установите MetaMask!");
		}
	};

	const logContainerRef = useRef(null);

	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTo(0, 0);
		}
	}, [logMessages]);







  useEffect(() => {
    // Настроить интервал, который вызывает updateCoal каждые 10 секунд
    const intervalId = setInterval(() => {
      updateCoal(); // Вызов функции каждые 10 секунд
    }, 2000); // 10000 миллисекунд = 10 секунд

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании компонента








	const isFetching = useRef(false);

	const fetchGrid = async () => {
		if (isFetching.current) return; // Если уже выполняется запрос, не запускаем новый
		isFetching.current = true;
		setLoading(true);

		if (contract) {
			try {
				console.log("Fetching grid data");
				const rows = await Promise.all(
					Array.from({
						length: 10
					}, async (_, x) => {
						const row = await Promise.all(
							Array.from({
								length: 10
							}, async (_, y) => {
								try {
									const result = await contract.getCell(x, y);
									if (!result || result === null) {
										console.error(`Получены пустые данные для ячейки (${x}, ${y})`);

										return {
											x,
											y,
											content: "contentEmpty",
											tool: "toolEmpty",
											man: "manEmpty",
											coalAmount: "0",
											ironAmount: "0",
											ironplateAmount: "0",
											lastBlockChecked: "0",
											componentsAmount: "0",
											factorySettings: "0"
										};
									}

									const content = result.content || "Null";
									const tool = result.tool || "toolEmpty";
									const man = result.man || "manEmpty";
									const coalAmount = result.coalAmount ? result.coalAmount.toString() : "0";
									const ironAmount = result.ironAmount ? result.ironAmount.toString() : "0";
									const ironplateAmount = result.ironplateAmount ? result.ironplateAmount.toString() : "0";
									const lastBlockChecked = result.lastBlockChecked ? result.lastBlockChecked.toString() : "0";
									const componentsAmount = result.componentsAmount ? result.componentsAmount.toString() : "0";
									const factorySettings = result.factorySettings ? result.factorySettings.toString() : "0";

									return {
										x,
										y,
										content,
										tool,
										man,
										coalAmount,
										ironAmount,
										ironplateAmount,
										lastBlockChecked,
										componentsAmount,
										factorySettings
									};
								}
								catch (error) {
									console.error(`Ошибка при получении данных для ячейки (${x}, ${y}):`, error);
									return {
										x,
										y,
										content: "contentEmpty",
										tool: "toolEmpty",
										man: "manEmpty",
										coalAmount: "0",
										ironAmount: "0",
										ironplateAmount: "0",
										lastBlockChecked: "0",
										componentsAmount: "0",
										factorySettings: "0"
									};
								}
							})
						);
						return row;
					})
				);

				// Фильтруем все null значения, если такие есть
				setGrid(rows.filter(row => row !== null));
				try {
					setLoading(true);
					const result = await contract.getDepot();
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

					setDepot({
						drillsAmount, // Количество дрелей
						boxesAmount, // Количество ящиков
						mansAmount, // Количество манипуляторов
						furnaceAmount, // Количество манипуляторов
						factoryAmount, // Количество заводов
						starttimee,
						lastmeteoritTimeChecked,
						blocktimestamp,
						bulldozerAmount,
						early

					});
				}
				catch (error) {
					console.error("Ошибка при получении данных депо:", error);
				}
				finally {
					setLoading(false);
				}

			}
			catch (error) {
				console.error("Ошибка при получении данных fetchGrid:", error);
			}
		}

		setLoading(false);
		isFetching.current = false;
	};

	useEffect(() => {
		const intervalId = setInterval(fetchGrid, 5000); // Интервальный запуск

		return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
	}, [contract]); // Запуск только при изменении контракта
	
	

	
	
	
	

	useEffect(() => {
		const interval = setInterval(() => {
			const currentTime = Math.floor(Date.now() / 1000); // Текущее время
			const difference = currentTime - depot.blocktimestamp - depot.early + 7700;
			//const difference = depot.early;
			
			
			        const distance = currentTime - depot.starttimee + 7700;
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













	const executeAllFunctions = async () => {

		await updateCoal();
		console.log("Meteorit function executed successfully.");

	};





	let transactionQueue = []; // Очередь транзакций
	let isProcessing = false; // Флаг, который блокирует выполнение при наличии активной транзакции
	let currentNonce = undefined; // Переменная для nonce

	const sendTransaction = async (contractMethod, params = []) => {
		// Добавляем новый запрос в очередь
		transactionQueue.push({
			contractMethod,
			params
		});

		// Если нет активных транзакций, начинаем обработку очереди
		if (!isProcessing) {
			await processQueue();
		}
	};

	const processQueue = async () => {
		// Пока в очереди есть элементы, обрабатываем их по очереди
		while (transactionQueue.length > 0) {
			const {
				contractMethod,
				params
			} = transactionQueue[0]; // Берем первый запрос из очереди

			// Выполняем транзакцию
			await executeTransaction(contractMethod, params);

			// Удаляем обработанный запрос из очереди
			transactionQueue.shift();
		}
	};

	const executeTransaction = async (contractMethod, params = []) => {
		try {
			// Устанавливаем флаг, что транзакция выполняется
			isProcessing = true;

			setLoading(true);
			const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
			const wallet = new ethers.Wallet(userPrivateKey, provider);
			const contract = new ethers.Contract(contractAddress, SimpleGridABI, wallet);

			// Получаем актуальный nonce для текущего кошелька
			if (currentNonce === undefined) {
				currentNonce = await provider.getTransactionCount(wallet.address, 'latest');
			}

			console.log("Current nonce before transaction:", currentNonce);

			// Создаем и отправляем транзакцию
			const tx = params.length ?
				await contract[contractMethod](...params, {
					nonce: currentNonce,
					gasLimit: gasLLimit,
				}) :
				await contract[contractMethod]({
					nonce: currentNonce,
					gasLimit: gasLLimit,
				});

			// Ожидаем подтверждения транзакции
			await tx.wait();

			// Увеличиваем nonce после успешной транзакции
			currentNonce++;

			console.log("Transaction successful. Incrementing nonce.");
			//if (contractMethod !== "updateCoal") {

setLogMessage('📡'); // Устанавливаем сообщение

setTimeout(() => {
  setLogMessage(''); // Очищаем сообщение через 3 секунды
}, 30000); // 3000 миллисекунд = 3 секунды


			setLogMessages(prev => [{
					text: `Сигнал отправлен.📡 ${new Date().toLocaleTimeString()}`,
					color: 'LimeGreen'
				},
				...prev
			]);



			//}
		}
		catch (error) {

			// Увеличиваем nonce при ошибке, чтобы избежать повторного использования
			currentNonce++;
			if (contractMethod !== "updateCoal") {
				console.error(`${contractMethod} error`, error);


				setLogMessages(prev => [{
						text: `Сигнал не отправлен! ${new Date().toLocaleTimeString()}`,
						color: 'red'
					},
					...prev
				]);



				setTimeout(() => {
					setlogErrorMessage("");
				}, 3000);
			}
		}
		finally {
			// Снимаем флаг и отключаем индикатор загрузки
			isProcessing = false;
			setLoading(false);
		}
	};



	const getCell = async (x, y) => {
		if (contract) {
			try {
				// Получаем данные ячейки
				const cell = await contract.getCell(x, y);

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
`;

				// Логируем данные в консоль
				console.log(cellDataMessage);

				// Обновляем лог-сообщение

				//setLogMessages(prev => [cellDataMessage, ...prev]);

				setLogMessages(prev => [{
						text: cellDataMessage,
						color: 'gray'
					},
					...prev
				]);



			}
			catch (error) {
				console.error("Ошибка getCell:", error);
			}
		}
	};










const getDepot = async () => {
    if (contract) {
        try {
            // Получаем данные депо
            const depot = await contract.getDepot();

            // Формируем сообщение со всеми данными депо
            const depotDataMessage = `
Depot Data:
${depot.drillsAmount} - Drills
${depot.boxesAmount} - Boxes
${depot.mansAmount} - Mans
${depot.furnaceAmount} - Furnace
${depot.factoryAmount} - Factory
${depot.starttimee} - Start Time
${depot.lastmeteoritTimeChecked} - Last Meteorite Time Checked
${depot.blocktimestamp} - Block Timestamp
${depot.bulldozerAmount} - Bulldozer
${depot.early} - Early
`;

            // Логируем данные в консоль
            console.log(depotDataMessage);

            // Обновляем лог-сообщение
            setLogMessages(prev => [{
                text: depotDataMessage,
                color: 'gray'
            }, ...prev]);

        }
        catch (error) {
            console.error("Ошибка getDepot:", error);
        }
    }
};















	const updateStarttimee = async (x, y, decrementValue) => {
		sendTransaction(decrementValue); // передаем decrementValue в sendTransaction
	};

	const placeDrill = (x, y) => {
		sendTransaction("placeDrill", [x, y]);
	};

	const removeTool = (x, y) => {
		sendTransaction("removeTool", [x, y]);
	};

	const placeBox = (x, y) => {
		sendTransaction("placeBox", [x, y]);
	};

	const drillsF = (x, y) => {
		sendTransaction("drillsF", [x, y]);
	};


	const boxesF = (x, y) => {
		sendTransaction("boxesF", [x, y]);
	};


	const mansF = (x, y) => {
		sendTransaction("mansF", [x, y]);
	};


	const furnaceF = (x, y) => {
		sendTransaction("furnaceF", [x, y]);
	};


	const factoryF = (x, y) => {
		sendTransaction("factoryF", [x, y]);
	};


	const bulldozerF = (x, y) => {
		sendTransaction("bulldozerF", [x, y]);
	};


	const componentsF = (x, y) => {
		sendTransaction("componentsF", [x, y]);
	};



	const placeFurnace = (x, y) => {
		sendTransaction("placeFurnace", [x, y]);
	};

	const placeFactory = (x, y) => {
		sendTransaction("placeFactory", [x, y]);
	};

	const placeBulldozer = (x, y) => {
		sendTransaction("placeBulldozer", [x, y]);
	};



	const initializeGrid = () => {
		sendTransaction("initializeGrid");
	};


	const updateCoal = () => {
		sendTransaction("updateCoal");
	};

	const meteoritfunction = () => {
		sendTransaction("meteoritfunction");
	};

	const placeManLR = (x, y) => {
		sendTransaction("placeManLR", [x, y]);
	};

	const placeManRL = (x, y) => {
		sendTransaction("placeManRL", [x, y]);
	};

	const placeManUD = (x, y) => {
		sendTransaction("placeManUD", [x, y]);
	};

	const placeManDU = (x, y) => {
		sendTransaction("placeManDU", [x, y]);
	};

	const handleCellClick2 = async (cell) => {
		setSelectedCell2(cell);
	}

	const handleCellClick = async (cell) => {
		setSelectedCell(cell);



		if (action) {
			const {
				x,
				y
			} = cell;
			switch (action) {
				case "placeDrill":

					await placeDrill(x, y);
					break;

				case "drillsF":
					await sendTransaction("factorySettingsUpdate", [x, y, "drillsF"]);
					break;

				case "boxesF":
					await sendTransaction("factorySettingsUpdate", [x, y, "boxesF"]);
					break;


				case "mansF":
					await sendTransaction("factorySettingsUpdate", [x, y, "mansF"]);
					break;


				case "furnaceF":
					await sendTransaction("factorySettingsUpdate", [x, y, "furnaceF"]);
					break;


				case "factoryF":
					await sendTransaction("factorySettingsUpdate", [x, y, "factoryF"]);
					break;


				case "bulldozerF":
					await sendTransaction("factorySettingsUpdate", [x, y, "bulldozerF"]);
					break;

				case "componentsF":
					await sendTransaction("factorySettingsUpdate", [x, y, "componentsF"]);
					break;


				case "removeTool":
					await removeTool(x, y);
					break;
				case "placeBox":

					await placeBox(x, y);
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
					await executeAllFunctions();
					await placeManDU(x, y);
					break;
				case "getCell":
					getCell(x, y);
					break;
				default:
					console.error("Не выбрано действие");
			}
		}
		else {
			
				setLogMessages(prev => [{
						text: `Не выбрано действие! ${new Date().toLocaleTimeString()}`,
						color: 'red'
					},
					...prev
				]);			
						
		}
	};

	const getButtonColorwhite = (actionType) => {

		return "white";
	};



	const getButtonColor = (actionType) => {
		if (action === actionType) {
			return "blue";
		}
		return "white";
	};
	/*
			const getCellStyle = (cell) => {
				let style = {
					width: '30px',
					height: '30px',

					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					cursor: 'pointer',
					border: '1px solid #ccc',
				};

				if (selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y) {
					style = {
						...style,
						border: '2px solid blue',
						backgroundColor: 'lightyellow'
					}; // выделение клетки
				}


















				return style;
			};*/

	useEffect(() => {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			window.ethereum.request({
				method: "eth_requestAccounts"
			});
			setContract(new ethers.Contract(contractAddress, SimpleGridABI, provider.getSigner()));
		}
	}, []);

	const executeAction = async (manualAction = null) => {
		const currentAction = manualAction || action;

		switch (currentAction) {
			
			
			case "getDepot":

				await getDepot();

				break;

			case "initializeGrid":

				await initializeGrid();

				break;

			case "updateCoal":

				await updateCoal();

				break;

			case "updateAll":

				await executeAllFunctions();


				break;

			case "meteoritfunction":
				await meteoritfunction();
				break;


			case "fetchGrid":
				await fetchGrid();
				break;

			case "starttimeeUpdate":
				executeAllFunctions();
				const decrementValue = prompt("Введите значение для уменьшения starttimee:");
				if (decrementValue) {
					try {

						await sendTransaction("starttimeeUpdate", [decrementValue]); // Вызов функции контракта
						console.log(`Starttimee уменьшено на ${decrementValue}`);
					}
					catch (error) {
						console.error("Ошибка при обновлении starttimee:", error);
					}
				}

				break;


			default:
				console.error("console.error: executeAction");
		}

		setAction("getCell"); // Сбрасываем действие после выполнения
	};









	if (!userPrivateKey || !isKeyConfirmed) {
		return ( <
			div style = {
				{
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					zIndex: 1000,
					color: 'white',
				}
			} >
			<
			div style = {
				{
					backgroundColor: 'black',
					padding: '20px',
					borderRadius: '10px',
					textAlign: 'center',
				}
			} >
			<
			p > Введите приватный ключ для подпространственной связи с астероидом.Осторожно, код в основном писал ИИ и он может вас ограбить🤖.)): < /p> <
	input
	type = "password"
	placeholder = "Приватный ключ"
	value = {
		userPrivateKey
	}
	style = {
		{
			width: '50%',
			padding: '10px',
			margin: '10px 0',
			borderRadius: '5px',
		}
	}
	onChange = {
		(e) => setUserPrivateKey(e.target.value)
	}
	/> <
	button
	onClick = {
		() => {
			if (!userPrivateKey) {
				alert('Введите приватный ключ.');
			}
			else {
				setIsKeyConfirmed(true); // Подтверждаем ключ
			}
		}
	}
	style = {
			{
				backgroundColor: 'green',
				color: 'white',
				padding: '10px 20px',
				border: 'none',
				borderRadius: '5px',
				cursor: 'pointer',
			}
		} >
		Подтвердить <
		/button> < /
		div > <
		/div>
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




return ( <
		div className = "App" > {
			<
			div >




			<
			div >








			{
				/* Кнопка для updateCoal */
			} <
			button
			onClick = {
				() => executeAction("updateCoal")
			}
			style = {
				{
					backgroundColor: getButtonColor("updateCoal"),
				}
			} > 🔄 <
			/button>

			{
				/* Кнопка для getCell */
			} <
			button
			onClick = {
				() => executeAction("getCell")
			}
			style = {
				{
					backgroundColor: getButtonColorwhite("getCell"),
				}
			} > ℹ️ <
			/button>






<button
  onClick={() => {
    if (action === "placeBulldozer") {
      setAction("getCell"); 
    } else {
      setAction("placeBulldozer"); 
    }
  }}
  style={{
    backgroundColor: getButtonColor("placeBulldozer"),
  }}
>
  🔨
</button>











<button
  onClick={() => {
    if (action === "placeDrill") {
      setAction("getCell"); 
    } else {
      setAction("placeDrill"); 
    }
  }}
  style={{
    backgroundColor: getButtonColor("placeDrill"),
  }}
>
  🚜
</button>


<button
  onClick={() => {
    if (action === "placeBox") {
      setAction("getCell"); 
    } else {
      setAction("placeBox"); 
    }
  }}
  style={{
    backgroundColor: getButtonColor("placeBox"),
  }}
>
  📦
</button>




<button
  onClick={() => {
    if (action === "placeFurnace") {
      setAction("getCell"); 
    } else {
      setAction("placeFurnace"); 
    }
  }}
  style={{
    backgroundColor: getButtonColor("placeFurnace"),
  }}
>
  🔥
</button>


<button
  onClick={() => {
    if (action === "placeFactory") {
      setAction("getCell"); 
    } else {
      setAction("placeFactory"); 
    }
  }}
  style={{
    backgroundColor: getButtonColor("placeFactory"),
  }}
>
  🏭
</button>









			<
			select
			onChange = {
				(e) => setAction(e.target.value)
			}
			value = {
				action
			}
			style = {
				{
					//marginLeft: '1px',
					width: '77px'  // Устанавливаем фиксированную ширину
				}
			} >
			<
				option value = "" > 🏭→❔ < /option> <
			option value = "componentsF" > 🏭→🧩 < /option> <
			option value = "drillsF" > 🏭→🚜 < /option> <
			option value = "boxesF" > 🏭→📦 < /option> <
			option value = "mansF" > 🏭→↔️ < /option> <
			option value = "furnaceF" > 🏭→🔥 < /option> <
			option value = "factoryF" > 🏭→🏭 < /option> <
			option value = "bulldozerF" > 🏭→🔨 < /option> <
 /
			select >
<button
  onClick={() => {
    if (action === "removeTool") {
      setAction("getCell"); // Сбрасываем действие, если оно уже установлено на "removeTool"
    } else {
      setAction("removeTool"); // Устанавливаем действие на "removeTool"
    }
  }}
  style={{
    backgroundColor: getButtonColor("removeTool"),
  }}
>
  ❌
</button>

			
			{
				/* Кнопка starttimeeUpdate */
			}

			<
			button
			onClick = {
				() => executeAction("starttimeeUpdate")
			}
			style = {
				{
					backgroundColor: getButtonColor("starttimeeUpdate"),
				}
			} > ⏩ <
			/button>






			{
				/* Кнопка для Начать новый астероид */
			} <
			button
			onClick = {
				() => {
					if (window.confirm("Вы уверены, что хотите начать новый астероид? Текущий будет потерян в просторах космоса навсегда!")) {
						executeAction("initializeGrid");
					}
				}
			}
			style = {
				{
					backgroundColor: getButtonColor("initializeGrid"),
				}
			} >
			🔍 <
			/button>









			<
			/div>
			<
			div style = {
				{
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}
			} > {
				/* Кнопка вверх */
			}   <button
    onClick={() => {
      if (action === "placeManDU") {
        setAction("getCell"); // Сбрасываем состояние, если оно уже равно "placeManDU"
      } else {
        setAction("placeManDU"); // Устанавливаем новое действие
      }
    }}
    style={{
      backgroundColor: getButtonColor("placeManDU"),
    }}
  >
    ⬆️
  </button>

			{
				/* Кнопки влево и вправо */
			} <
			div style = {
				{
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}
			} >
    <button
      onClick={() => {
        if (action === "placeManRL") {
          setAction("getCell"); // Сбрасываем состояние, если оно уже равно "placeManRL"
        } else {
          setAction("placeManRL"); // Устанавливаем новое действие
        }
      }}
      style={{
        backgroundColor: getButtonColor("placeManRL"),
      }}
    >
      ⬅️
    </button>     <button
      onClick={() => {
        if (action === "placeManLR") {
          setAction("getCell"); // Сбрасываем состояние, если оно уже равно "placeManLR"
        } else {
          setAction("placeManLR"); // Устанавливаем новое действие
        }
      }}
      style={{
        backgroundColor: getButtonColor("placeManLR"),
      }}
    >
      ➡️
    </button> < /
			div >

			{
				/* Кнопка вниз */
			}   <button
    onClick={() => {
      if (action === "placeManUD") {
        setAction("getCell"); // Сбрасываем состояние, если оно уже равно "placeManUD"
      } else {
        setAction("placeManUD"); // Устанавливаем новое действие
      }
    }}
    style={{
      backgroundColor: getButtonColor("placeManUD"),
    }}
  >
    ⬇️
  </button>

			<
			/div>
			
			
			
			
			
			
			
			
			
			
			
			
			





			{
				/* Кнопка для Запросить данные с астероида*/
			} <
			button
			onClick = {
				() => executeAction("updateCoal")
			}
			style = {
				{
					backgroundColor: getButtonColor("updateCoal"),
				}
			} >
			updateCoal <
			/button>

			{
				/* meteoritfunction */
			} <
			button
			onClick = {
				() => executeAction("meteoritfunction")
			}
			style = {
				{
					backgroundColor: getButtonColor("meteoritfunction"),
				}
			} >
			meteoritfunction <
			/button>


			{
				/* fetchGrid */
			} <
			button
			onClick = {
				() => executeAction("fetchGrid")
			}
			style = {
				{
					backgroundColor: getButtonColor("fetchGrid"),
				}
			} >
			fetchGrid <
			/button>
			
			
			
			
			
						{
				/* getDepot */
			} <
			button
			onClick = {
				() => executeAction("getDepot")
			}
			style = {
				{
					backgroundColor: getButtonColor("getDepot"),
				}
			} >
			getDepot <
			/button>
			
			
			






















			<
			>
			{
				grid && grid.length > 0 && (

					<
					div style = {
						{
							display: 'flex', // Используем flexbox для выравнивания
							justifyContent: 'center', // Центрируем по горизонтали
							width: '100vw', // Ширина контейнера на весь экран
							//height: '100vh', // Высота контейнера на весь экран
							alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
						}
					} >



					<
					div style = {
						{
							display: 'grid',
							gridTemplateColumns: `repeat(${grid.length}, 30px)`,
							gap: '1px'
						}
					} > {
						grid[0].map((_, colIndex) => (
							grid.map((_, rowIndex) => {
								const cell = grid[rowIndex][grid[0].length - 1 - colIndex];
								return ( <
									div key = {
										`${rowIndex}-${colIndex}`
									}
									style = {
										{
											width: '30px',
											height: '30px',
											backgroundColor: cell.content === "contentEmpty" ? '#00990f' : cell.content === "Iron" ? 'silver' : cell.content === "Space" ? '#121212' : cell.content === "Ruins" ? '#7d0f00' :cell.content === "Coal" ? '#474747' :cell.content === "Null" ? '#121212' : '#121212',

											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
											border: selectedCell2 && selectedCell2.x === cell.x && selectedCell2.y === cell.y ? '2px solid blue' : 'none',
											boxSizing: 'border-box',
											fontSize: '16px',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											textAlign: 'center',
											whiteSpace: 'normal', // Разрешаем перенос текста
											flexDirection: 'column', // Элементы будут располагаться вертикально
										}
									}
									onClick = {
										() => handleCellClick(cell)
									}

									onMouseDown = {
										() => handleCellClick2(cell)
									}
									onMouseUp = {
										() => handleCellClick2(null)
									}

									>
									
									
									
									{
										cell.content === "Space" && ( <
											>
											🌑 < br / >
											<
											/>
										)
									} 
									{
										cell.content === "Ruins" && ( <
											>
											🌑 < br / >
											<
											/>
										)
									} 									
									
									
									{
										cell.tool === "Box" && ( <
											>
											📦 < br / >
											<
											/>
										)
									} {
										cell.tool === "Drill" && ( <
											>
											🚜 < br / >
											<
											/>
										)
									} {
										cell.tool === "Furnace" && ( <
											>
											🔥 < br / >
											<
											/>
										)
									} {
										cell.tool === "Factory" && ( <
											>
											🏭 < br / >
											<
											/>
										)
									}

									{
										cell.coalAmount > 0 && ( <
											span style = {
												{
													fontSize: '6px',
													fontFamily: 'Arial, sans-serif',
													fontWeight: 'bold',
													display: 'block'
												}
											} > {
												` c:${cell.coalAmount}`
											} <
											/span>
										)
									}
									
									
									
									
																		{
										cell.componentsAmount > 0 && ( <
											span style = {
												{
													fontSize: '6px',
													fontFamily: 'Arial, sans-serif',
													fontWeight: 'bold',
													display: 'block'
												}
											} > {
												` 🧩:${cell.componentsAmount}`
											} <
											/span>
										)
									}




									{
										cell.ironAmount > 0 && ( <
											span style = {
												{
													fontSize: '6px',
													fontFamily: 'Arial, sans-serif',
													fontWeight: 'bold',
													display: 'block'
												}
											} > {
												` i:${cell.ironAmount}`
											} <
											/span>
										)
									} {
										cell.ironplateAmount > 0 && ( <
											span style = {
												{
													fontSize: '6px',
													fontFamily: 'Arial, sans-serif',
													fontWeight: 'bold',
													display: 'block'
												}
											} > {
												` p:${cell.ironplateAmount}`
											} <
											/span>
										)
									} {
										cell.man === "LR" ? '➡️' : ''
									} {
										cell.man === "RL" ? '⬅️' : ''
									} {
										cell.man === "UD" ? '⬇️' : ''
									} {
										cell.man === "DU" ? '⬆️' : ''
									}

									</div>




								);
							})
						))} 
					</div>
				</div>



				)




			} <
			/> 
			
			
			
			<
			p
			style = {
				{
							display: 'flex', // Используем flexbox для выравнивания
							justifyContent: 'center', // Центрируем по горизонтали
							width: '100vw', // Ширина контейнера на весь экран
							//height: '100vh', // Высота контейнера на весь экран
							alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
					margin: '0',
					color: '#ffe500', // Устанавливаем цвет текста
					fontWeight: 'bold', // Дополнительно делаем текст жирным (опционально)
					fontSize: '12px', // Размер шрифта
					//border: "1px solid #ccc",
				}
			} >
			Последние данные {
				//timePassed
			}
			 <
			/p> 
			
			
			<
			p
			style = {
				{
							display: 'flex', // Используем flexbox для выравнивания
							justifyContent: 'center', // Центрируем по горизонтали
							width: '100vw', // Ширина контейнера на весь экран
							//height: '100vh', // Высота контейнера на весь экран
							alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
					margin: '0',
					color: '#b5047a', // Устанавливаем цвет текста
					fontWeight: 'bold', // Дополнительно делаем текст жирным (опционально)
					fontSize: '12px', // Размер шрифта
					//border: "1px solid #ccc",
				}
			} >
			Вы пролетели уже  {
				Distance
			}
			 &nbsp;километров. <
			/p> 			
			
			
			
			
			
			
			<
			div style = {
				{
							display: 'flex', // Используем flexbox для выравнивания
							justifyContent: 'center', // Центрируем по горизонтали
							width: '100vw', // Ширина контейнера на весь экран
							//height: '100vh', // Высота контейнера на весь экран
							alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
					//position: 'fixed', // Закрепляет блок относительно окна
					//bottom: '10px', // Отступ от верхнего края
					//right: '40px', // Отступ от правого края
					flexWrap: 'wrap', // Разрешает перенос элементов на новую строку
					gap: '5px', // Уменьшаем отступ между элементами
					color: 'SaddleBrown', // Цвет текста
					//width: '309px', // Ограничиваем ширину

					fontSize: '12px', // Размер шрифта
					lineHeight: '16px', // Межстрочный интервал
					padding: '5px', // Отступы внутри контейнера
				}
			} >




			<
			p style = {
				{
					margin: '0'
				}
			} > 🚜: {
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
			} > 🔨: {
				depot.bulldozerAmount
			} < /p>  <
			p style = {
				{

					margin: '0'
				}
			} > ↔️: {
				depot.mansAmount
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
			div >

			<
			div
			style = {
				{
							/*justifyContent: 'center', // Центрируем по горизонтали
							width: '100vw', // Ширина контейнера на весь экран
							//height: '100vh', // Высота контейнера на весь экран
							alignItems: 'flex-start', // Прижимаем сетку к верхнему краю
					//position: 'fixed', // Закрепляет блок относительно окна
					//bottom: '10px', // Отступ от верхнего края
					//right: '40px', // Отступ от правого края
					flexWrap: 'wrap', // Разрешает перенос элементов на новую строку
					gap: '5px', // Уменьшаем отступ между элементами
					color: 'SaddleBrown', // Цвет текста
					//width: '309px', // Ограничиваем ширину

					fontSize: '12px', // Размер шрифта
					lineHeight: '16px', // Межстрочный интервал
					padding: '5px', // Отступы внутри контейнера*/






      position: 'absolute',
      color: 'LimeGreen',
      marginTop: "5px",
      padding: "10px",
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100vw",
      height: "70px",
      border: "1px solid #808080",
      resize: "vertical",
      boxSizing: "border-box"
 
				}
			}
			ref = {
				logContainerRef
			} > {
				logMessages.map((msg, index) => ( <
					pre key = {
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
					} <
					/pre>
				))
			} <
			/div>







			<
			div
			style = {
				{
					position: 'fixed', // Закрепляет блок относительно окна
					top: '50px', // Отступ от верхнего края
					right: '10px', // Отступ от правого края
					color: 'LimeGreen', // Цвет текста

					marginTop: "5px",
					padding: "10px",
					//border: "1px solid #ccc",
					// width: "150px",
					//height: "10px", // Фиксированная высота
					//backgroundColor: "#797979",
					overflow: "auto", // Прокрутка, если текст длинный
					display: "flex", // Flexbox для управления расположением текста
					alignItems: "flex-start", // Выравнивание по верхнему краю
				}
			} > {
				/* Поле для лог-сообщений */
			} {
				logMessage && < p style = {
						{
							margin: 0,
							padding: 0
						}
					} > {
						logMessage
					} < /p>}  < /
					div >





					<
					div
				style = {
						{
							position: 'fixed', // Закрепляет блок относительно окна
							bottom: '120px', // Отступ от верхнего края
							right: '30px', // Отступ от правого края
							color: 'red', // Цвет текста
							marginTop: "5px",
							padding: "10px",
							overflow: "auto", // Прокрутка, если текст длинный
							display: "flex", // Flexbox для управления расположением текста
							alignItems: "flex-start", // Выравнивание по верхнему краю
						}
					} > {
						/* Поле для лог-сообщений */
					} {
						logErrorMessage && < p style = {
							{
								margin: 0,
								padding: 0
							}
						} > {
							logErrorMessage
						} < /p>} < /
						div >









							<
							/div>	

					}









					<
					/div>

			);

		};

		export default App;
		/*
		Уже доступно:

		Начни новый астероид.
		Поставь буры на уголь и железо.
		Ставь ящики, манипуляторы, собирай ресурсы.
		Манипуляторы мощные - сразу всё перемещают, поэтому быстро разряжаются. Для работы их нужно перезапускать (в планах сделать автоперезапуск).


		В разработке:

		Крафт, Печи, железо, батарейки, силовое поле, астероиды, ловушки для астероидов, чертежи, перенос ценности на обновления и многое другое.*/