import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleGridABI from './SimpleGridABI.json';
document.body.style.backgroundColor = "#121212";
document.body.style.color = "#121212";
const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const contractAddress = "0xD4f1878c91f693E0F1Eb7BADe154cf2AF8797eC8";

const checkWalletConnection = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      console.log("Уже подключён:", accounts[0]);
      connectWallet(); // Автоматическое подключение
    }
  }
};

useEffect(() => {
  checkWalletConnection();
}, []);


const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Инициализация провайдера
      const prov = new ethers.providers.Web3Provider(window.ethereum);

      // Запрос аккаунтов
      const accounts = await prov.send('eth_requestAccounts', []);
      if (accounts.length === 0) {
        alert("Нет доступных аккаунтов в MetaMask.");
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
    } catch (error) {
      console.error("Ошибка подключения кошелька:", error);
      alert("Ошибка подключения кошелька. Проверьте MetaMask.");
    }
  } else {
    alert("Установите MetaMask!");
  }
};


  
const initializeGrid = async () => {
  if (contract) {
    try {
      console.log("Инициализация сетки...");
      await contract.initializeGrid();  // Вызов функции контракта для инициализации сетки
      fetchGrid();  // Обновляем сетку после инициализации
    } catch (error) {
      console.error("Ошибка инициализации сетки:", error);
    }
  }
};

  const fetchGrid = async () => {
    setLoading(true);
    if (contract) {
      try {
        console.log("Fetching grid data...");

        const rows = await Promise.all(
          Array.from({ length: 10 }, async (_, x) => {
            const row = await Promise.all(
              Array.from({ length: 10 }, async (_, y) => {
                console.log(`Fetching data for cell (${x}, ${y})`);

                const result = await contract.getCell(x, y);

                console.log(`Data for cell (${x}, ${y}):`, result);

                const ore = result.content;
                const drill = result.drill;
                const coalAmount = result.coalAmount;
                const lastBlockChecked = result.lastBlockChecked;
                const box = result.box;
				const man = result.man;

                console.log(`Ore: ${ore}, Drill: ${drill}, Coal Amount: ${coalAmount}, Last Block Checked: ${lastBlockChecked}, Box: ${box}`);

                return { x, y, ore, drill, coalAmount, lastBlockChecked, box, man  };
              })
            );
            return row;
          })
        );
        setGrid(rows);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }
    setLoading(false);
  };

  const placeOre = async (x, y) => {
    if (contract) {
      try {
        await contract.placeOre(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения руды:", error);
      }
    }
  };



  const removeOre = async (x, y) => {
    if (contract) {
      try {
        await contract.removeOre(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка удаления руды:", error);
      }
    }
  };

  const placeDrill = async (x, y) => {
    if (contract) {
      try {
        await contract.placeDrill(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения бура:", error);
      }
    }
  };

  const removeDrill = async (x, y) => {
    if (contract) {
      try {
        await contract.removeDrill(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка удаления бура:", error);
      }
    }
  };

  const placeBox = async (x, y) => {
    if (contract) {
      try {
        await contract.placeBox(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения бокса:", error);
      }
    }
  };

  const removeBox = async (x, y) => {
    if (contract) {
      try {
        await contract.removeBox(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка удаления бокса:", error);
      }
    }
  };

  const transport = async () => {
    if (contract) {
      try {
        console.log("transport");
        await contract.transport();
        fetchGrid();
      } catch (error) {
        console.error("Ошибка transport", error);
      }
    }
  };
  
  const updateCoal = async () => {
    if (contract) {
      try {
        console.log("updateCoal");
        await contract.updateCoal();
        fetchGrid();
      } catch (error) {
        console.error("Ошибка updateCoal", error);
      }
    }
  };

  const placeManLR = async (x, y) => {
    if (contract) {
      try {
        await contract.placeManLR(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения placeManLR:", error);
      }
    }
  };
  
  const placeManRL = async (x, y) => {
    if (contract) {
      try {
        await contract.placeManRL(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения placeManRL:", error);
      }
    }
  };
  
  const placeManUD = async (x, y) => {
    if (contract) {
      try {
        await contract.placeManUD(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения placeManUD:", error);
      }
    }
  };
  
  const placeManDU = async (x, y) => {
    if (contract) {
      try {
        await contract.placeManDU(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения placeManDU:", error);
      }
    }
  };
  
    const removeMan = async (x, y) => {
    if (contract) {
      try {
        await contract.removeMan(x, y);
        fetchGrid();
      } catch (error) {
        console.error("Ошибка размещения removeMan:", error);
      }
    }
  };
  
  const handleCellClick = (cell) => {
    setSelectedCell(cell);
  };

  const executeAction = async () => {
    if (selectedCell) {
      const { x, y } = selectedCell;

      switch (action) {
        case "placeOre":
          await placeOre(x, y);
          break;
        case "removeOre":
          await removeOre(x, y);
          break;
        case "placeDrill":
          await placeDrill(x, y);
          break;
        case "removeDrill":
          await removeDrill(x, y);
          break;
        case "placeBox":
          await placeBox(x, y);
          break;
        case "removeBox":
          await removeBox(x, y);
          break;
        case "transport":
          await transport();
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
	    case "removeMan":
          await removeMan(x, y);
          break;		  
		  		  
		  
		  
		  
		  
        default:
          console.error("Не выбрано действие");
      }

      setAction(null);
      setSelectedCell(null);
    } else { switch (action){
          case "transport":
          await transport();
          break;
          case "updateCoal":
          await updateCoal();
          break;

		  // Код, который выполняется, если условие ложно (false)
	}
		        setAction(null);
      setSelectedCell(null);
}
  };

  const getButtonColor = (actionType) => {
    if (action === actionType) {
      return "lightblue";
    }
    return "white";
  };

  const getCellStyle = (cell) => {
    let style = {
      width: '30px',
      height: '30px',
      backgroundColor: (cell.ore === "Ore" ? 'gray' : 'lightgreen'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: '1px solid #ccc',
    };

    if (selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y) {
      style = { ...style, border: '2px solid blue', backgroundColor: 'lightyellow' }; // выделение клетки
    }

    return style;
  };


useEffect(() => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" });
    setContract(new ethers.Contract(contractAddress, SimpleGridABI, provider.getSigner()));
  }
}, []);


  return (
    <div className="App">
      <h4>Simple Grid DApp</h4>
      {!provider ? (
        <button onClick={connectWallet}>Подключить кошелёк (я кнопка тупенькая, часто только со второго раза понимаю O.o )</button>
      ) : (
        <div>
          <button onClick={fetchGrid} disabled={loading}>
            {loading ? "Загрузка...Если грузит дольше 15 секунд - обнови страницу - заблокируй метамаск - и подключись к игре из заблокированного под пароль метамаска" : "Загрузить последние данные с астероида"}
          </button>
           <button 
  onClick={initializeGrid}
  style={{
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px',
    backgroundColor: 'lightgreen',
    border: 'none',
    cursor: 'pointer',
  }}
>
  Начать новый астероид
</button>
          <div>
            <h3>Выберите действие:</h3>
			<button onClick={executeAction}style={{

    backgroundColor: 'violet',

  }}>--->Выполнить</button>
             <button onClick={() => setAction("updateCoal")} style={{ backgroundColor: getButtonColor("updateCoal") }}>
              Обновить счётчики руды
            </button>
			<button onClick={() => setAction("transport")} style={{ backgroundColor: getButtonColor("transport") }}>
              Перезарядить и запустить манипуляторы
            </button>
            <button onClick={() => setAction("placeOre")} style={{ backgroundColor: getButtonColor("placeOre") }}>
              Добавить руду
            </button>
            <button onClick={() => setAction("removeOre")} style={{ backgroundColor: getButtonColor("removeOre") }}>
              Убрать руду
            </button>
            <button onClick={() => setAction("placeDrill")} style={{ backgroundColor: getButtonColor("placeDrill") }}>
              Разместить бур
            </button>
            <button onClick={() => setAction("removeDrill")} style={{ backgroundColor: getButtonColor("removeDrill") }}>
              Убрать бур
            </button>
            <button onClick={() => setAction("placeBox")} style={{ backgroundColor: getButtonColor("placeBox") }}>
              Разместить Box
            </button>
            <button onClick={() => setAction("removeBox")} style={{ backgroundColor: getButtonColor("removeBox") }}>
              Убрать Box
            </button>
                          <button onClick={() => setAction("removeMan")} style={{ backgroundColor: getButtonColor("removeMan") }}>
              Убрать Манипулятор
            </button>
          </div>
		  
		  
		  
	<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <button onClick={() => setAction("placeManDU")} style={{ backgroundColor: getButtonColor("placeManDU") }}>
    ↑
  </button>

  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <button onClick={() => setAction("placeManRL")} style={{ backgroundColor: getButtonColor("placeManRL") }}>
      ←
    </button>
    <button onClick={() => setAction("placeManLR")} style={{ backgroundColor: getButtonColor("placeManLR") }}>
      →
    </button>
  </div>
  <button onClick={() => setAction("placeManUD")} style={{ backgroundColor: getButtonColor("placeManUD") }}>
    ↓
  </button>

  
</div>


          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)', gap: '1px' }}>
            {grid.map((row, rowIndex) => (
              row.map((cell, cellIndex) => (
                <div
  key={`${rowIndex}-${cellIndex}`}
  style={{
    width: '30px',
    height: '30px',
    backgroundColor: (cell.ore === "Ore" ? 'gray' : 'lightgreen'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: selectedCell && selectedCell.x === cell.x && selectedCell.y === cell.y ? '2px solid blue' : 'none',  // Добавляем синий бордер для выделенной клетки
    boxSizing: 'border-box'  // Убедитесь, что бордер не влияет на размер клетки
  }}
  onClick={() => handleCellClick(cell)}
>
  {cell.ore === "Ore" ? '' : ''}
  {cell.drill ? 'D' : ''}
  {cell.box ? 'B' : ''}
  {cell.coalAmount > 0 ? ` c${cell.coalAmount}` : ''}
  {cell.man === "LR" ? '→' : ''}
  {cell.man === "RL" ? '←' : ''}
  {cell.man === "UD" ? '↓' : ''}
  {cell.man === "DU" ? '↑' : ''}
</div>

              ))
            ))}
          </div>
        </div>
      )}
    </div>
  );

};

export default App;
