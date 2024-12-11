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
const defaultPrivateKey = ""; // Ваш тестовый приватный ключ
const [userPrivateKey, setUserPrivateKey] = useState(defaultPrivateKey);
const [isKeyConfirmed, setIsKeyConfirmed] = useState(!!defaultPrivateKey); // Подтверждаем, если ключ уже есть


  const [timePassed, setTimePassed] = useState('');
		const contractAddress = "0x85495222Fd7069B987Ca38C2142732EbBFb7175D";


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

										const content = result.content || "Coal";
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
      const difference = currentTime - depot.lastmeteoritTimeChecked;

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

				//await updateCoal();
				//console.log("Coal updated successfully.");

				await updateCoal();
				console.log("Meteorit function executed successfully.");

		};


		const initializeGrid = async () => {
			try {
				setLoading(true);
				const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Ваш RPC URL
				const wallet = new ethers.Wallet(userPrivateKey, provider);
				const contract = new ethers.Contract(contractAddress, SimpleGridABI, wallet);
				console.log("Инициализация сетки...");
				const nonce = await provider.getTransactionCount(wallet.address, 'latest');
				console.log("Current nonce:", nonce);



				const tx = await contract.initializeGrid({
					nonce: nonce, // Устанавливаем nonce
					gasLimit: gasLLimit, // Устанавливаем лимит газа
				});
				await tx.wait();



				console.log("Сетка инициализированна.");
				setLogMessage("Ищем новый астероид..."); // Обновляем лог-сообщение
				setTimeout(() => {
					setLogMessage(""); // Очищаем лог-сообщение через 3 секунды
				}, 5000); // 3000 миллисекунд = 3 секунды 
			}
			catch (error) {
				console.error("Ошибка инициализации сетки:", error);
			}
			finally {
				setLoading(false);
			}
		};









let transactionQueue = []; // Очередь транзакций
let isProcessing = false; // Флаг, который блокирует выполнение при наличии активной транзакции
let currentNonce = undefined; // Переменная для nonce

const sendTransaction = async (contractMethod, params = []) => {
    // Добавляем новый запрос в очередь
    transactionQueue.push({ contractMethod, params });

    // Если нет активных транзакций, начинаем обработку очереди
    if (!isProcessing) {
        await processQueue();
    }
};

const processQueue = async () => {
    // Пока в очереди есть элементы, обрабатываем их по очереди
    while (transactionQueue.length > 0) {
        const { contractMethod, params } = transactionQueue[0]; // Берем первый запрос из очереди

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
        const tx = params.length 
            ? await contract[contractMethod](...params, {
                nonce: currentNonce,
                gasLimit: gasLLimit,
            })
            : await contract[contractMethod]({
                nonce: currentNonce,
                gasLimit: gasLLimit,
            });

        // Ожидаем подтверждения транзакции
        await tx.wait();

        // Увеличиваем nonce после успешной транзакции
        currentNonce++;

        console.log("Transaction successful. Incrementing nonce.");
if (contractMethod !== "updateCoal") {
        setLogMessage("📡");
        setTimeout(() => {
            setLogMessage("");
        }, 2000);
}
    } catch (error) {

        // Увеличиваем nonce при ошибке, чтобы избежать повторного использования
        currentNonce++;
if (contractMethod !== "updateCoal") {
	    console.error(`${contractMethod} error`, error);

        setlogErrorMessage("Ошибка отправки сигнала.", error);
		setTimeout(() => {
        setlogErrorMessage("");
        }, 3000);
}
    } finally {
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

					// Логируем все данные ячейки
					console.log(`Cell Data at (${x}, ${y}):`);
					console.log(`Content: ${cell.content}`);
					console.log(`Tool: ${cell.tool}`);
					console.log(`Coal Amount: ${cell.coalAmount}`);
					console.log(`Last Time Checked: ${cell.lastTimeChecked}`);
					console.log(`Man: ${cell.man}`);
					console.log(`Iron Amount: ${cell.ironAmount}`);
					console.log(`Iron Plate Amount: ${cell.ironplateAmount}`);
					console.log(`componentsAmount: ${cell.componentsAmount}`);
					console.log(`factorySettings: ${cell.factorySettings}`);
					// Обновляем лог-сообщение
					setLogMessage("Данные ячейки получены.");
					setTimeout(() => {
						setLogMessage(""); // Очищаем лог-сообщение через 3 секунды
					}, 3000); // 3000 миллисекунд = 3 секунды
				}
				catch (error) {
					console.error("Ошибка getCell:", error);
				}
			}
		};



/*const initializeGrid = async (x, y, decrementValue) => {
    sendTransaction(initializeGrid); // передаем decrementValue в sendTransaction
};*/

const updateStarttimee = async (x, y, decrementValue) => {
    sendTransaction(decrementValue); // передаем decrementValue в sendTransaction
};

const placeDrill =(x, y) => {
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


const mansF =  (x, y) => {
    sendTransaction("mansF", [x, y]);
};


const furnaceF =  (x, y) => {
    sendTransaction("furnaceF", [x, y]);
};


const factoryF =  (x, y) => {
    sendTransaction("factoryF", [x, y]);
};


const bulldozerF =(x, y) => {
    sendTransaction("bulldozerF", [x, y]);
};


const componentsF = (x, y) => {
    sendTransaction("componentsF", [x, y]);
};



		const placeFurnace =  (x, y) => {
    sendTransaction("placeFurnace", [x, y]);
		};

		const placeFactory =  (x, y) => {
    sendTransaction("placeFactory", [x, y]);
		};

		const placeBulldozer =  (x, y) => {
    sendTransaction("placeBulldozer", [x, y]);
		};






		const updateCoal =  () => {
    sendTransaction("updateCoal");
		};
		
		const meteoritfunction =  () => {
    sendTransaction("meteoritfunction");
		};

		const placeManLR =  (x, y) => {
    sendTransaction("placeManLR", [x, y]);
		};

		const placeManRL =  (x, y) => {
    sendTransaction("placeManRL", [x, y]);
		};

		const placeManUD =  (x, y) => {
    sendTransaction("placeManUD", [x, y]);
		};

		const placeManDU =  (x, y) => {
    sendTransaction("placeManDU", [x, y]);
		};

		const handleCellClick2 = async (cell) => {
			    setSelectedCell2(cell);
		}

		const handleCellClick = async (cell) => {
			    setSelectedCell(cell);

				/*setTimeout(() => {
					setLogMessage(""); // Очищаем лог-сообщение через 3 секунды
				}, 5000); // 3000 миллисекунд = 3 секунды */
		
			if (action) {
				const {
					x,
					y
				} = cell;
				switch (action) {
					case "placeDrill":

						await executeAllFunctions();
						await placeDrill(x, y);
						break;
						
					case "drillsF":
						await executeAllFunctions();
						await drillsF(x, y);
						break;
						
					case "boxesF":
						await executeAllFunctions();
						await boxesF(x, y);
						break;

						
					case "mansF":
						await executeAllFunctions();
						await mansF(x, y);
						break;

						
					case "furnaceF":
						await executeAllFunctions();
						await furnaceF(x, y);
						break;

						
					case "factoryF":
						await executeAllFunctions();
						await factoryF(x, y);
						break;

						
					case "bulldozerF":
						await executeAllFunctions();
						await bulldozerF(x, y);
						break;
						
					case "componentsF":
						await executeAllFunctions();
						await componentsF(x, y);
						break;
					
						
					case "removeTool":
						await executeAllFunctions();
						await removeTool(x, y);
						break;
					case "placeBox":

						await executeAllFunctions();
						await placeBox(x, y);
						break;
					case "placeFurnace":

						await executeAllFunctions();
						await placeFurnace(x, y);
						break;
					case "placeFactory":

						await executeAllFunctions();
						await placeFactory(x, y);
						break;
					case "placeBulldozer":

						await executeAllFunctions();
						await placeBulldozer(x, y);
						break;
					case "placeManLR":

						await executeAllFunctions();
						await placeManLR(x, y);
						break;
					case "placeManRL":

						await executeAllFunctions();
						await placeManRL(x, y);
						break;
					case "placeManUD":

						await executeAllFunctions();
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
				console.log("Не выбрано действие!");
				setlogErrorMessage("Не выбрано действие!"); 
						setTimeout(() => {
        setlogErrorMessage("");
        }, 3000);
				// Обновляем лог-сообщение
			}
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

				case "updateCoal":

					await meteoritfunction();
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

			setAction(null); // Сбрасываем действие после выполнения
		};






















if (!userPrivateKey || !isKeyConfirmed) {
    return (
        <div
            style={{
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
            }}
        >
            <div
                style={{
                    backgroundColor: 'black',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                }}
            >
                <p>Введите приватный ключ для подпространственной связи с астероидом. Осторожно, код в основном писал ИИ и он может тебя ограбить🤖. )) :</p>
                <input
                    type="password"
                    placeholder="Приватный ключ"
                    value={userPrivateKey}
                    style={{
                        width: '50%',
                        padding: '10px',
                        margin: '10px 0',
                        borderRadius: '5px',
                    }}
                    onChange={(e) => setUserPrivateKey(e.target.value)}
                />
                <button
                    onClick={() => {
                        if (!userPrivateKey) {
                            alert('Введите приватный ключ.');
                        } else {
                            setIsKeyConfirmed(true); // Подтверждаем ключ
                        }
                    }}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Подтвердить
                </button>
            </div>
        </div>
    );
}






















		return ( <
			div className = "App" > {
				<
				div >

				<
				button
				onClick = {
					initializeGrid
				}
				style = {
					{
						position: 'fixed', // Закрепляет кнопку относительно окна
						bottom: '80px', // Отступ от нижнего края
						right: '20px', // Отступ от правого края
						padding: '10px',
						backgroundColor: 'green',
						fontSize: '6px',
						border: 'none',
						cursor: 'pointer',
					}
				}

				>
				Начать новый астероид <
				/button> <
				div >







	
				{
					/* Кнопка для updateAll */
				} <
				button
				onClick = {
					() => executeAction("updateAll")
				}
				style = {
					{
						backgroundColor: getButtonColor("updateAll"),
					}
				} > 🔄 <
				/button>






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
				} >
				⏩ <
				/button>


      <select
        onChange={(e) => setAction(e.target.value)}
        value={action}
        style={{ marginLeft: '10px' }}
      >
        <option value="drillsF">Drills</option>
        <option value="boxesF">Boxes</option>
        <option value="mansF">Mans</option>
        <option value="furnaceF">Furnace</option>
        <option value="factoryF">Factory</option>
        <option value="bulldozerF">Bulldozer</option>
        <option value="componentsF">Components</option>
      </select>




				{
					/* Кнопка для удаления строения */
				} <
				button
				onClick = {
					() => setAction("removeTool")
				}
				style = {
					{
						backgroundColor: getButtonColor("removeTool"),
					}
				} > ❌ <
				/button>

				{
					/* Кнопка для размещения бура */
				} <
				button
				onClick = {
					() => setAction("placeDrill")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeDrill"),
					}
				} > 🚜 <
				/button>

				{
					/* Кнопка для размещения Box */
				} <
				button
				onClick = {
					() => setAction("placeBox")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeBox"),
					}
				} > 📦 <
				/button>

				{
					/* Кнопка для размещения Furnace */
				} <
				button
				onClick = {
					() => setAction("placeFurnace")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeFurnace"),
					}
				} > 🔥 <
				/button>

				{
					/* Кнопка для размещения Factory */
				} <
				button
				onClick = {
					() => setAction("placeFactory")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeFactory"),
					}
				} > 🏭 <
				/button>



				{
					/* Кнопка для размещения bulldozer */
				} <
				button
				onClick = {
					() => setAction("placeBulldozer")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeBulldozer"),
					}
				} > 🔨 <
				/button>

				{
					/* Кнопка для размещения bulldozer */
				} <
				button
				onClick = {
					() => setAction("drillsF")
				}
				style = {
					{
						backgroundColor: getButtonColor("drillsF"),
					}
				} > drillsF <
				/button>

				{
					/* Кнопка для getCell */
				} <
				button
				onClick = {
					() => setAction("getCell")
				}
				style = {
					{
						backgroundColor: getButtonColor("getCell"),
					}
				} >
				getCell <
				/button>

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



				<
				div style = {
					{
						display: "flex",
						flexDirection: "column",
						alignItems: "center"
					}
				} > {
					/* Кнопка вверх */
				} <
				button
				onClick = {
					() => setAction("placeManDU")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeManDU")
					}
				} > ↑
				<
				/button>

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
				<
				button
				onClick = {
					() => setAction("placeManRL")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeManRL")
					}
				} > ←
				<
				/button> <
				button
				onClick = {
					() => setAction("placeManLR")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeManLR")
					}
				} > →
				<
				/button> < /
				div >

				{
					/* Кнопка вниз */
				} <
				button
				onClick = {
					() => setAction("placeManUD")
				}
				style = {
					{
						backgroundColor: getButtonColor("placeManUD")
					}
				} > ↓
				<
				/button>

				<
				/div>




				<
				div style = {
					{
						position: 'fixed', // Закрепляет блок относительно окна
						top: '10px', // Отступ от верхнего края
						right: '40px', // Отступ от правого края
						display: 'flex',
						flexWrap: 'wrap', // Разрешает перенос элементов на новую строку
						gap: '5px', // Уменьшаем отступ между элементами
						color: 'SaddleBrown', // Цвет текста
						width: '40px', // Ограничиваем ширину
						fontSize: '12px', // Размер шрифта
						lineHeight: '16px', // Межстрочный интервал
						padding: '5px', // Отступы внутри контейнера
					}
				} >
				
  <p
    style={{
      margin: '0',
      color: '#ffe500', // Устанавливаем цвет текста
      fontWeight: 'bold', // Дополнительно делаем текст жирным (опционально)
    }}
  >
    Последние данные получены {timePassed} назад.
  </p>
				
				
				<
				p style = {
					{
						margin: '0'
					}
				} > Склад < /p> <
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
				} > 🧩: {
					depot.componentsAmount
				} < /p> <
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
				>
				{
					grid && grid.length > 0 && ( <
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
												backgroundColor: cell.content === "contentEmpty" ? 'lightgreen' : cell.content === "Iron" ? 'silver' : cell.content === "Space" ? '#402303' : 'gray',

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
										onClick={() => handleCellClick(cell)}

										onMouseDown={() => handleCellClick2(cell)}
										onMouseUp={() => handleCellClick2(null)}

										 > {
											cell.content === "Space" && ( <
												>
												🌑 < br / >
												<
												/>
											)
										} {
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
													` c-${cell.coalAmount}`
												} <
												/span>
											)
										} {
											cell.ironAmount > 0 && ( <
												span style = {
													{
														fontSize: '6px',
														fontFamily: 'Arial, sans-serif',
														fontWeight: 'bold',
														display: 'block'
													}
												} > {
													` i-${cell.ironAmount}`
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
													` p-${cell.ironplateAmount}`
												} <
												/span>
											)
										} {
											cell.man === "LR" ? '→' : ''
										} {
											cell.man === "RL" ? '←' : ''
										} {
											cell.man === "UD" ? '↓' : ''
										} {
											cell.man === "DU" ? '↑' : ''
										}

										<
										/div>
									);
								})
							))
						} <
						/div>
					)
				} <
				/>




				<
				div
				style = {
					{
						position: 'fixed', // Закрепляет блок относительно окна
						bottom: '150px', // Отступ от верхнего края
						right: '30px', // Отступ от правого края
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
					} < /p>} 
					< /
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