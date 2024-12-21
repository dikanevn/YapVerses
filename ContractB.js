// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8 .0;

interface IMainGrid {
	
	struct Cell {
        string content;
        string tool;
        uint256 coalAmount;
        uint256 lastTimeChecked;
        string man;
        uint256 ironAmount;
        uint256 ironplateAmount;
        uint256 componentsAmount;
        string factorySettings;
        string previouscontent;
		uint256 wallPowerAmount;
    }	
	
	function getCell(address user, uint256 x, uint256 y) external view returns (Cell memory);

	
	struct Depot {
        uint256 gridSize;
        uint256 drillsAmount;
        uint256 boxesAmount;
        uint256 mansAmount;
        uint256 furnaceAmount;
        uint256 factoryAmount;
        uint256 starttimee;
        uint256 lastmeteoritTimeChecked;
        uint256 blocktimestamp;
        uint256 bulldozerAmount;
        uint256 early;
        uint256 mmmtime;
        uint256 mmmdrillSpeed;
        uint256 iterationLimitDepot;
    uint256 isPaused;       // 1 - пауза активна, 0 - игра идёт
    uint256 pausedDuration; // Накопленное время паузы
    uint256 pauseStartTime; // Время начала текущей паузы		
	 uint256 wallAmount;	
	 	 uint256 theEndCount;
uint256 speedkoef;




    }

    function getDepot(address user) external view returns (Depot memory);
	
	
    function updateDepotSpeedkoef(address user, uint256 speedkoef) external;
	function getMaxBox() external view returns (uint256);
    function updateContent(address user, uint256 x, uint256 y, string memory content) external;
    function updateTool(address user, uint256 x, uint256 y, string memory tool) external;
    function updateCoalAmount(address user, uint256 x, uint256 y, uint256 coalAmount) external;
    function updateLastTimeChecked(address user, uint256 x, uint256 y, uint256 lastTimeChecked) external;
    function updateMan(address user, uint256 x, uint256 y, string memory man) external;
    function updateIronAmount(address user, uint256 x, uint256 y, uint256 ironAmount) external;
    function updateIronplateAmount(address user, uint256 x, uint256 y, uint256 ironplateAmount) external;
    function updateComponentsAmount(address user, uint256 x, uint256 y, uint256 componentsAmount) external;
    function updateFactorySettings(address user, uint256 x, uint256 y, string memory factorySettings) external;
    function updatePreviousContent(address user, uint256 x, uint256 y, string memory previouscontent) external;


    function updateDepotGridSize(address user, uint256 gridSize) external;
    function updateDepotDrillsAmount(address user, uint256 drillsAmount) external;
    function updateDepotBoxesAmount(address user, uint256 boxesAmount) external;
    function updateDepotMansAmount(address user, uint256 mansAmount) external;
    function updateDepotFurnaceAmount(address user, uint256 furnaceAmount) external;
    function updateDepotFactoryAmount(address user, uint256 factoryAmount) external;
    function updateDepotStarttimee(address user, uint256 starttimee) external;
    function updateDepotLastMeteoritTimeChecked(address user, uint256 lastmeteoritTimeChecked) external;
    function updateDepotBlockTimestamp(address user, uint256 blocktimestamp) external;
    function updateDepotBulldozerAmount(address user, uint256 bulldozerAmount) external;
    function updateDepotEarly(address user, uint256 early) external;
    function updateDepotMmmtime(address user, uint256 mmmtime) external;
    function updateDepotMmmdrillSpeed(address user, uint256 mmmdrillSpeed) external;
    function updateDepotiterationLimitDepot(address user, uint256 iterationLimitDepot) external;
    function setDepotPause(address user, uint256 isPaused) external;
    function updateDepotPausedDuration(address user, uint256 pausedDuration) external;
    function updateDepotPauseStartTime(address user, uint256 pauseStartTime) external;
   function updateDepotWallAmount(address user, uint256 wallAmount) external;
function updateWallPowerAmount(address user, uint256 x, uint256 y, uint256 wallPowerAmount) external;
function updateDepotTheEndCount(address user, uint256 theEndCount) external;


    function updateDepotPart1(
        address user,
		uint256 gridSize,
        uint256 drillsAmount,
        uint256 boxesAmount,
        uint256 mansAmount,
        uint256 furnaceAmount,
        uint256 factoryAmount,
		uint256 wallAmount
    ) external;

    // Вторая часть обновления депо
    function updateDepotPart2(
        address user,
        uint256 starttimee,
        uint256 lastmeteoritTimeChecked,
        uint256 blocktimestamp,
        uint256 bulldozerAmount,
        uint256 early,
        uint256 mmmtime,
        uint256 mmmdrillSpeed,
        uint256 iterationLimitDepot,
		uint256 isPaused,
		uint256 pausedDuration,
		uint256 pauseStartTime
		
		
    ) external;
}









































contract ContractBBB {
	IMainGrid private mainGrid;
	address public admin;
	uint256 public constant oreProbability = 20;

	// События
	event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
	event MainGridAddressChanged(address indexed oldAddress, address indexed newAddress);
	event Debug(string message, uint256 value);
 // События для отладки и отслеживания
    event MeteoriteImpacted(string direction, uint256 x, uint256 y);
    event MeteoritePlaced(uint256 x, uint256 y);

    // Константы направлений
    enum Direction { UP, RIGHT, DOWN, LEFT }

    // Нонс для генерации случайных чисел
    uint256 private nonce;	// Модификатор для ограничения доступа администратору
	modifier onlyAdmin() {
		require(msg.sender == admin, "Not an admin");
		_;
	}

	// Конструктор для установки администратора и адреса основного контракта
	constructor(address mainGridAddress) {
		require(mainGridAddress != address(0), "MainGrid address cannot be zero");
		mainGrid = IMainGrid(mainGridAddress);
		admin = msg.sender; // Устанавливаем администратора
	}
	
	
	
function validateRequire(IMainGrid.Depot memory depot) internal view {
    require(block.timestamp - depot.blocktimestamp < 300, "Wait for the update");
    require(depot.isPaused == 0, "paused");
    require(depot.theEndCount > 100, "Game Over");
	require(depot.early < 300, "Wait for the update");
}
	
	






























	function transferResourses(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Проверяем координаты
		IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);
		//require(fromX < depot.gridSize && fromY < depot.gridSize, "Invalid source coordinates");
		//require(toX < depot.gridSize && toY < depot.gridSize, "Invalid destination coordinates");

		// Выполняем перенос ресурсов
		transferCoal(fromX, fromY, toX, toY);
		transferIron(fromX, fromY, toX, toY);
		transferIronPlate(fromX, fromY, toX, toY);
		transferComponents(fromX, fromY, toX, toY);
	}

	function transferCoal(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Получаем данные ячеек через основной контракт
		IMainGrid.Cell memory source = mainGrid.getCell(msg.sender, fromX, fromY);
		IMainGrid.Cell memory destination = mainGrid.getCell(msg.sender, toX, toY);

		// Получаем максимальный размер Box через основной контракт
		uint256 MaxBox = mainGrid.getMaxBox();

		// Проверяем условия для переноса ресурсов
		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")) ||
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Furnace"))
			) && (
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Drill")) ||
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Box"))
			)
		) {
			uint256 resourceToMove = source.coalAmount / 5;
			uint256 availableSpaceInBox = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred;

			// Вычисляем количество ресурсов для перемещения
			if (resourceToMove > availableSpaceInBox) {
				resourceTransferred = availableSpaceInBox;
				mainGrid.updateCoalAmount(msg.sender, toX, toY, MaxBox); // Достигаем лимита
			}
			else {
				resourceTransferred = resourceToMove;
				mainGrid.updateCoalAmount(msg.sender, toX, toY, destination.coalAmount + resourceToMove);
			}

			// Обновляем количество угля в исходной ячейке
			mainGrid.updateCoalAmount(msg.sender, fromX, fromY, source.coalAmount - resourceTransferred);
		}
	}

	function transferIron(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Получаем данные ячеек через основной контракт
		IMainGrid.Cell memory source = mainGrid.getCell(msg.sender, fromX, fromY);
		IMainGrid.Cell memory destination = mainGrid.getCell(msg.sender, toX, toY);

		// Получаем максимальный размер Box через основной контракт
		uint256 MaxBox = mainGrid.getMaxBox();

		// Проверяем условия для переноса ресурсов
		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")) ||
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Furnace"))
			) && (
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Drill")) ||
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Box"))
			)
		) {
			uint256 resourceToMove = source.ironAmount / 5;
			uint256 availableSpaceInBox = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred;

			// Вычисляем количество ресурсов для перемещения
			if (resourceToMove > availableSpaceInBox) {
				resourceTransferred = availableSpaceInBox;
				mainGrid.updateIronAmount(msg.sender, toX, toY, MaxBox); // Достигаем лимита
			}
			else {
				resourceTransferred = resourceToMove;
				mainGrid.updateIronAmount(msg.sender, toX, toY, destination.ironAmount + resourceToMove);
			}

			// Обновляем количество железа в исходной ячейке
			mainGrid.updateIronAmount(msg.sender, fromX, fromY, source.ironAmount - resourceTransferred);
		}
	}


	function transferIronPlate(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Получаем данные ячеек через основной контракт
		IMainGrid.Cell memory source = mainGrid.getCell(msg.sender, fromX, fromY);
		IMainGrid.Cell memory destination = mainGrid.getCell(msg.sender, toX, toY);

		// Получаем максимальный размер Box через основной контракт
		uint256 MaxBox = mainGrid.getMaxBox();

		// Проверяем условия для переноса ресурсов
if (
    keccak256(abi.encodePacked(source.factorySettings)) != keccak256(abi.encodePacked("componentsF")) && // Проверка source
    (keccak256(abi.encodePacked(destination.factorySettings)) == keccak256(abi.encodePacked("componentsF")) || // Проверка destination
    keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")) ||
	keccak256(abi.encodePacked(destination.factorySettings)) == keccak256(abi.encodePacked("wallF")))
) {
			uint256 resourceToMove = source.ironplateAmount / 5;
			uint256 availableSpaceInBox = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred;

			// Вычисляем количество ресурсов для перемещения
			if (resourceToMove > availableSpaceInBox) {
				resourceTransferred = availableSpaceInBox;
				mainGrid.updateIronplateAmount(msg.sender, toX, toY, MaxBox); // Достигаем лимита
			}
			else {
				resourceTransferred = resourceToMove;
				mainGrid.updateIronplateAmount(msg.sender, toX, toY, destination.ironplateAmount + resourceToMove);
			}

			// Обновляем количество железных пластин в исходной ячейке
			mainGrid.updateIronplateAmount(msg.sender, fromX, fromY, source.ironplateAmount - resourceTransferred);
		}
	}


	function transferComponents(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Получаем данные ячеек через основной контракт
		IMainGrid.Cell memory source = mainGrid.getCell(msg.sender, fromX, fromY);
		IMainGrid.Cell memory destination = mainGrid.getCell(msg.sender, toX, toY);

		// Получаем максимальный размер Box через основной контракт
		uint256 MaxBox = mainGrid.getMaxBox();

		// Проверяем условия для переноса ресурсов
		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Factory")) &&
				keccak256(abi.encodePacked(destination.factorySettings)) != keccak256(abi.encodePacked("componentsF"))
				|| 
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box"))
			) 
			&&
			(
				keccak256(abi.encodePacked(source.factorySettings)) == keccak256(abi.encodePacked("componentsF")) ||
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Box"))
			)
			
			
			
			
			
		) {
			uint256 resourceToMove = source.componentsAmount / 5;
			uint256 availableSpaceInBox = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred;

			// Вычисляем количество ресурсов для перемещения
			if (resourceToMove > availableSpaceInBox) {
				resourceTransferred = availableSpaceInBox;
				mainGrid.updateComponentsAmount(msg.sender, toX, toY, MaxBox); // Достигаем лимита
			}
			else {
				resourceTransferred = resourceToMove;
				mainGrid.updateComponentsAmount(msg.sender, toX, toY, destination.componentsAmount + resourceToMove);
			}

			// Обновляем количество компонентов в исходной ячейке
			mainGrid.updateComponentsAmount(msg.sender, fromX, fromY, source.componentsAmount - resourceTransferred);
		}
	}

function removeTool(uint256 x, uint256 y, uint256 /* unused */) public {
    // Проверяем координаты
    IMainGrid.Cell memory cell = mainGrid.getCell(msg.sender, x, y);
    IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);

		require(depot.isPaused == 0, "paused");
		//require(depot.theEndCount > 100, "Game Over");
     require(x < depot.gridSize && y < depot.gridSize, "Invalid coordinates");

    string memory toolType = cell.tool;
    require(keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("toolEmpty")), "toolEmpty");
    require(keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Space")), "Space");
    require(keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
	
	
	
	
    // Возвращаем инструмент в депо
    if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Drill"))) {
        mainGrid.updateDepotDrillsAmount(msg.sender, depot.drillsAmount + 1);
    } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Box"))) {
        mainGrid.updateDepotBoxesAmount(msg.sender, depot.boxesAmount + 1);
    } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Man"))) {
        mainGrid.updateDepotMansAmount(msg.sender, depot.mansAmount + 1);
    } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Furnace"))) {
        mainGrid.updateDepotFurnaceAmount(msg.sender, depot.furnaceAmount + 1);
    } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Factory"))) {
        mainGrid.updateDepotFactoryAmount(msg.sender, depot.factoryAmount + 1);
    }

    // Сбрасываем состояние ячейки через основной контракт
    mainGrid.updateMan(msg.sender, x, y, "manEmpty");
    mainGrid.updateTool(msg.sender, x, y, "toolEmpty");
    mainGrid.updateCoalAmount(msg.sender, x, y, 0);
    mainGrid.updateIronAmount(msg.sender, x, y, 0);
    mainGrid.updateIronplateAmount(msg.sender, x, y, 0);
    mainGrid.updateComponentsAmount(msg.sender, x, y, 0);
    mainGrid.updateFactorySettings(msg.sender, x, y, "factorySettingsEmptyF");

    mainGrid.updateWallPowerAmount(msg.sender, x, y, 0); // Сбрасываем wallPowerAmount	
}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	





// Основная функция обработки метеорита
function meteoritfunction(uint256 externalRandom) public {
    IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);

    uint256 gridSize = depot.gridSize;

    require(depot.isPaused == 0, "paused");
   // require(depot.theEndCount > 100, "Game Over");
     require(gridSize > 0, "Grid size is not initialized");
    //emit Debug("Grid size initialized", gridSize);

if (block.timestamp - depot.pausedDuration - depot.lastmeteoritTimeChecked > depot.mmmtime / depot.speedkoef) {
        //emit Debug("Condition for meteorit event met", block.timestamp);

        // Шаг 1: Выбор случайной целевой ячейки
        (uint256 targetX, uint256 targetY) = selectRandomCell(gridSize, externalRandom);
        //emit Debug("Target cell selected", targetX * gridSize + targetY);

        // Шаг 2: Выбор случайной стороны для начала движения
        Direction edgeDirection = selectRandomEdgeDirection(externalRandom);
        //emit Debug("Starting edge direction selected", uint256(edgeDirection));

// Шаг 3: Вычисление начальной позиции метеорита на выбранной стороне с использованием targetX и targetY
(uint256 startX, uint256 startY) = getEdgeStartPosition(edgeDirection, gridSize, targetX, targetY);
       // emit Debug("Starting edge position", startX * gridSize + startY);

        // Шаг 4: Движение метеорита внутрь сетки
        moveMeteorite(startX, startY, gridSize, depot);

        // Обновляем временные метки депо
        depot.lastmeteoritTimeChecked += depot.mmmtime / depot.speedkoef;
    }
	mainGrid.updateDepotLastMeteoritTimeChecked(msg.sender, depot.lastmeteoritTimeChecked);
    mainGrid.updateDepotBlockTimestamp(msg.sender, block.timestamp);
    mainGrid.updateDepotEarly(msg.sender, block.timestamp - depot.pausedDuration - depot.lastmeteoritTimeChecked);

}	
	
	
// Функция выбора случайной ячейки
function selectRandomCell(uint256 gridSize, uint256 externalRandom) private view returns (uint256, uint256) {
    // Генерация псевдослучайного числа для X
    uint256 randomSeedX = uint256(
        keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, externalRandom, "X")
        )
    );
    uint256 startX = randomSeedX % gridSize;

    // Генерация псевдослучайного числа для Y
    uint256 randomSeedY = uint256(
        keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, externalRandom, "Y")
        )
    );
    uint256 startY = randomSeedY % gridSize;

    return (startX, startY);
}

	
// Выбор случайной стороны для начала движения
function selectRandomEdgeDirection(uint256 externalRandom) private view returns (Direction) {
    uint256 randDir = uint256(
        keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
				externalRandom
            )
        )
    ) % 4;

    return Direction(randDir); // UP, RIGHT, DOWN, LEFT
}	
	


// Получение стартовой позиции на краю сетки
function getEdgeStartPosition(
    Direction edgeDirection,
    uint256 gridSize,
    uint256 currentX,
    uint256 currentY
)
    private
    pure
    returns (uint256, uint256)
{
    if (edgeDirection == Direction.UP) {
        // Верхняя сторона: x устанавливается в 0, y сохраняется
        return (0, currentY);
    } else if (edgeDirection == Direction.RIGHT) {
        // Правая сторона: y устанавливается в gridSize - 1, x сохраняется
        return (currentX, gridSize - 1);
    } else if (edgeDirection == Direction.DOWN) {
        // Нижняя сторона: x устанавливается в gridSize - 1, y сохраняется
        return (gridSize - 1, currentY);
    } else {
        // Левая сторона: y устанавливается в 0, x сохраняется
        return (currentX, 0);
    }
}


// Движение метеорита с края внутрь
function moveMeteorite(
    uint256 startX,
    uint256 startY,
    uint256 gridSize,
    IMainGrid.Depot memory depot
) private {
    uint256 currentX = startX;
    uint256 currentY = startY;

    while (true) {
        // Получаем данные текущей ячейки
        IMainGrid.Cell memory currentCell = mainGrid.getCell(msg.sender, currentX, currentY);

        //emit Debug("Checking cell", currentX * gridSize + currentY);

        // Проверяем, можно ли разместить метеорит
        if (
            keccak256(abi.encodePacked(currentCell.tool)) != keccak256(abi.encodePacked("Space")) &&
            keccak256(abi.encodePacked(currentCell.tool)) != keccak256(abi.encodePacked("Ruins"))
        ) {
            // Размещаем метеорит
            handleMeteoriteImpact(currentX, currentY, depot);
            emit MeteoriteImpacted("Meteorite placed", currentX, currentY);
            break;
        }

        // Двигаемся к следующей ячейке
        bool outOfBounds;
        (currentX, currentY, outOfBounds) = getNextStep(currentX, currentY, startX, startY, gridSize);

        // Если достигли края сетки, завершаем движение
        if (outOfBounds) {
            emit MeteoriteImpacted("Reached edge with no space", currentX, currentY);
            break;
        }
    }
}



function getNextStep(
    uint256 currentX,
    uint256 currentY,
    uint256 startX,
    uint256 startY,
    uint256 gridSize
) private pure returns (uint256, uint256, bool) {
    // Если начальная позиция была сверху, движемся вниз
    if (startX == 0) {
        if (currentX + 1 < gridSize) {
            return (currentX + 1, currentY, false);
        } else {
            return (currentX, currentY, true); // Достигли нижнего края
        }
    }

    // Если начальная позиция была справа, движемся влево
    if (startY == gridSize - 1) {
        if (currentY > 0) {
            return (currentX, currentY - 1, false);
        } else {
            return (currentX, currentY, true); // Достигли левого края
        }
    }

    // Если начальная позиция была снизу, движемся вверх
    if (startX == gridSize - 1) {
        if (currentX > 0) {
            return (currentX - 1, currentY, false);
        } else {
            return (currentX, currentY, true); // Достигли верхнего края
        }
    }

    // Если начальная позиция была слева, движемся вправо
    if (startY == 0) {
        if (currentY + 1 < gridSize) {
            return (currentX, currentY + 1, false);
        } else {
            return (currentX, currentY, true); // Достигли правого края
        }
    }

    return (currentX, currentY, true); // На случай ошибки
}





function handleMeteoriteImpact(uint256 x, uint256 y, IMainGrid.Depot memory depot) internal {
    IMainGrid.Cell memory cell = mainGrid.getCell(msg.sender, x, y);
    string memory toolType = cell.tool;

    // Если инструмент - "Wall", уменьшаем wallPowerAmount на 110 и завершаем выполнение
    if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Wall"))) {
        uint256 newWallPower = cell.wallPowerAmount > 110 ? cell.wallPowerAmount - 110 : 0;
        mainGrid.updateWallPowerAmount(msg.sender, x, y, newWallPower);

        // Если wallPowerAmount становится 0, обновляем инструмент на "Ruins"
        if (newWallPower == 0) {
             removeTool(x, y, 0);
        }

        return; // Завершаем выполнение функции
    }

    // Проверяем, что инструмент не является Space, Ruins или toolEmpty или Wall
    if (
        keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Space")) &&
        keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Ruins")) &&
        keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Wall")) &&
        keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("toolEmpty"))
    ) {
        // Вызываем removeTool для удаления инструмента
        removeTool(x, y, 0);
    }

// Логика обновления инструмента в зависимости от его текущего состояния
if (
    keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("toolEmpty"))
) {
    
        depot.theEndCount -= 1;
        mainGrid.updateDepotTheEndCount(msg.sender, depot.theEndCount);
    
    mainGrid.updateTool(msg.sender, x, y, "Space");
} else {
    
        depot.theEndCount -= 1;
        mainGrid.updateDepotTheEndCount(msg.sender, depot.theEndCount);
    
    mainGrid.updateTool(msg.sender, x, y, "Ruins");
}

}






































































function updateCoal(uint256 externalRandom) public {
    address user = msg.sender;
    uint256 maxBox = mainGrid.getMaxBox();

    // Получаем данные депо и размер сетки
    IMainGrid.Depot memory depot = mainGrid.getDepot(user);
    require(depot.isPaused == 0, "paused");
    //require(depot.theEndCount > 100, "Game Over");
    uint256 gridSize = depot.gridSize;

    // Обновляем временные метки депо

    // Проверяем и вызываем функцию метеорита при необходимости
    uint256 maxMeteors = depot.iterationLimitDepot; // Максимальное количество вызовов meteoritfunction за один раз
    uint256 meteorCount = 0;

while (_shouldCallMeteorit(depot) && meteorCount < maxMeteors) {
    _meteoritFunction(externalRandom + meteorCount);
    meteorCount++;

    // Обновляем временные метки после каждого вызова
    depot.lastmeteoritTimeChecked += depot.mmmtime / depot.speedkoef;
    mainGrid.updateDepotLastMeteoritTimeChecked(user, depot.lastmeteoritTimeChecked);

    // Повторно загружаем `depot` после изменения
    depot = mainGrid.getDepot(user);
}


    uint256 totalCells = gridSize * gridSize;

    // Генерация и перемешивание индексов ячеек
    uint256[] memory indices = _generateShuffledIndices(externalRandom, totalCells);

    // Обработка ячеек и сбор обновленных данных
    (
        IMainGrid.Cell[] memory updatedCells,
        bool[] memory isUpdated
    ) = _processCells(user, indices, gridSize, totalCells, depot, maxBox);

    // Обновляем измененные ячейки в mainGrid
    _updateMainGrid(user, indices, updatedCells, isUpdated, gridSize, totalCells);

    // Обновляем количества в депо
    _updateDepotAmounts(user, depot);
	 mainGrid.updateDepotBlockTimestamp(user, block.timestamp);
}




    // Проверка, нужно ли вызвать функцию метеорита
    function _shouldCallMeteorit(IMainGrid.Depot memory depot) internal view returns (bool) {
        return (block.timestamp - depot.pausedDuration - depot.lastmeteoritTimeChecked > depot.mmmtime / depot.speedkoef);
    }

    // Вызов функции метеорита
    function _meteoritFunction(uint256 externalRandom) internal {
        // Предполагается, что функция meteoritfunction уже определена
        meteoritfunction(externalRandom);
    }

    // Генерация и перемешивание индексов ячеек
    function _generateShuffledIndices(uint256 externalRandom, uint256 totalCells) internal view returns (uint256[] memory) {
        uint256[] memory indices = new uint256[](totalCells);
        for (uint256 i = 0; i < totalCells; i++) {
            indices[i] = i;
        }

        for (uint256 i = totalCells - 1; i > 0; i--) {
            uint256 j = uint256(
                keccak256(
                    abi.encodePacked(externalRandom, block.timestamp, block.prevrandao, i)
                )
            ) % (i + 1);
            (indices[i], indices[j]) = (indices[j], indices[i]);
        }

        return indices;
    }

    // Обработка ячеек и сбор обновленных данных
    function _processCells(
        address user,
        uint256[] memory indices,
        uint256 gridSize,
        uint256 totalCells,
        IMainGrid.Depot memory depot,
        uint256 maxBox
    )
        internal
        returns (IMainGrid.Cell[] memory updatedCells, bool[] memory isUpdated)
    {
        updatedCells = new IMainGrid.Cell[](totalCells);
        isUpdated = new bool[](totalCells);

        for (uint256 iter = 0; iter < totalCells; iter++) {
            uint256 index = indices[iter];
            (uint256 x, uint256 y) = _getCoordinates(index, gridSize);

            IMainGrid.Cell memory cell = mainGrid.getCell(user, x, y);

            // Фильтруем неактуальные ячейки
            if (_isCellIrrelevant(cell)) {
                continue;
            }

            // Обрабатываем логику ячейки
            _handleCellLogic(user, cell, x, y, depot, maxBox);

            // Сохраняем обновленную ячейку
            updatedCells[iter] = cell;
            isUpdated[iter] = true;
        }

        return (updatedCells, isUpdated);
    }

    // Получение координат x и y из индекса
    function _getCoordinates(uint256 index, uint256 gridSize) internal pure returns (uint256 x, uint256 y) {
        x = index % gridSize;
        y = index / gridSize;
    }

    // Проверка, является ли ячейка неактуальной
    function _isCellIrrelevant(IMainGrid.Cell memory cell) internal pure returns (bool) {
        bytes32 toolHash = keccak256(abi.encodePacked(cell.tool));
        return (
            toolHash == keccak256(abi.encodePacked("toolEmpty")) ||
            toolHash == keccak256(abi.encodePacked("Space")) ||
            toolHash == keccak256(abi.encodePacked("Ruins"))
        );
    }

    // Обработка логики ячейки
    function _handleCellLogic(
        address user,
        IMainGrid.Cell memory cell,
        uint256 x,
        uint256 y,
        IMainGrid.Depot memory depot,
        uint256 maxBox
    ) internal {
        // Обработка типа человека в ячейке
        _handleManType(cell, x, y);

        // Обработка содержания ячейки (уголь, железо)
        _handleContent(cell, depot, maxBox);

        // Обработка производственных построек (печь, фабрика)
        _handleProductionBuildings(user, cell, depot, maxBox);
    }

    // Обработка типа человека
    function _handleManType(IMainGrid.Cell memory cell, uint256 x, uint256 y) internal {
        bytes32 manType = keccak256(abi.encodePacked(cell.man));
        if (manType != keccak256(abi.encodePacked("manEmpty"))) {
            if (manType == keccak256(abi.encodePacked("LR"))) {
                transferResourses(x - 1, y, x + 1, y);
            } else if (manType == keccak256(abi.encodePacked("RL"))) {
                transferResourses(x + 1, y, x - 1, y);
            } else if (manType == keccak256(abi.encodePacked("UD"))) {
                transferResourses(x, y + 1, x, y - 1);
            } else if (manType == keccak256(abi.encodePacked("DU"))) {
                transferResourses(x, y - 1, x, y + 1);
            }
        }
    }

    // Обработка содержания ячейки (уголь, железо)
    function _handleContent(
        IMainGrid.Cell memory cell,
        IMainGrid.Depot memory depot,
        uint256 maxBox
    ) internal {
        bytes32 toolHash = keccak256(abi.encodePacked(cell.tool));
        bytes32 contentHash = keccak256(abi.encodePacked(cell.content));

        if (toolHash == keccak256(abi.encodePacked("Drill"))) {
            if (contentHash == keccak256(abi.encodePacked("Coal"))) {
uint256 newCoalAmount = cell.coalAmount +
    (block.timestamp - depot.pausedDuration - cell.lastTimeChecked) *
    (depot.mmmdrillSpeed * depot.speedkoef);
                cell.coalAmount = newCoalAmount > maxBox ? maxBox : newCoalAmount;
                cell.lastTimeChecked = block.timestamp - depot.pausedDuration;
            }

            if (contentHash == keccak256(abi.encodePacked("Iron"))) {
uint256 newIronAmount = cell.ironAmount +
    (block.timestamp - depot.pausedDuration - cell.lastTimeChecked) *
    (depot.mmmdrillSpeed * depot.speedkoef);
                cell.ironAmount = newIronAmount > maxBox ? maxBox : newIronAmount;
                cell.lastTimeChecked = block.timestamp - depot.pausedDuration;
            }
        }
    }

    // Обработка производственных построек (печь, фабрика)
    function _handleProductionBuildings(
        address user,
        IMainGrid.Cell memory cell,
        IMainGrid.Depot memory depot,
        uint256 maxBox
    ) internal {
        bytes32 toolHash = keccak256(abi.encodePacked(cell.tool));

        // Обработка печи
        if (toolHash == keccak256(abi.encodePacked("Furnace")) && cell.coalAmount >= 10 && cell.ironAmount >= 10) {
            uint256 coalUsed = 10;
            uint256 ironUsed = 10;
            uint256 ironPlateProduced = 1;
            while (cell.coalAmount >= coalUsed && cell.ironAmount >= ironUsed) {
                cell.coalAmount -= coalUsed;
                cell.ironAmount -= ironUsed;
                cell.ironplateAmount += ironPlateProduced;
            }
        }

        // Обработка фабрики для компонентов
        if (
            toolHash == keccak256(abi.encodePacked("Factory")) &&
            keccak256(abi.encodePacked(cell.factorySettings)) == keccak256(abi.encodePacked("componentsF")) &&
            cell.ironplateAmount >= 10
        ) {
            while (cell.ironplateAmount >= 10) {
                cell.ironplateAmount -= 10;
                cell.componentsAmount += 1;
            }
			

        }
if (
    toolHash == keccak256(abi.encodePacked("Factory")) &&
    keccak256(abi.encodePacked(cell.factorySettings)) == keccak256(abi.encodePacked("wallF")) &&
    cell.componentsAmount >= 10 && // Проверяем, что есть 10 компонентов
    depot.furnaceAmount >= 1  &&  // Проверяем, что есть 10 бульдозеров в депо
	cell.ironplateAmount >= 100 
) {
    while (
        cell.componentsAmount >= 10 && 
        depot.furnaceAmount >= 1 &&
		cell.ironplateAmount >= 100
		
    ) {
        cell.componentsAmount -= 10; // Сжигаем 10 компонентов
        depot.furnaceAmount -= 1; // Сжигаем 10 бульдозеров из депо
		cell.ironplateAmount -= 100;
		depot.wallAmount += 5;

        if (depot.wallAmount > 200) {
           // Ограничиваем максимум
            break; // Прерываем цикл
        }      // Увеличиваем количество стен в депо
    }

    // Обновляем значения депо через основной контракт
    mainGrid.updateDepotFurnaceAmount(msg.sender, depot.furnaceAmount);
    mainGrid.updateDepotWallAmount(msg.sender, depot.wallAmount);
	
 
}


        // Обработка фабрики для различных настроек
        if (toolHash == keccak256(abi.encodePacked("Factory")) && cell.componentsAmount >= 10) {
            bytes32 factorySettingsHash = keccak256(abi.encodePacked(cell.factorySettings));
            while (cell.componentsAmount >= 10) {
                cell.componentsAmount -= 10;
                if (factorySettingsHash == keccak256(abi.encodePacked("drillsF"))) {
                    depot.drillsAmount += 1;
                } else if (factorySettingsHash == keccak256(abi.encodePacked("boxesF"))) {
                    depot.boxesAmount += 1;
                } else if (factorySettingsHash == keccak256(abi.encodePacked("mansF"))) {
                    depot.mansAmount += 1;
                } else if (factorySettingsHash == keccak256(abi.encodePacked("furnaceF"))) {
                    depot.furnaceAmount += 1;
                } else if (factorySettingsHash == keccak256(abi.encodePacked("factoryF"))) {
                    depot.factoryAmount += 1;
                } else 
					
				
if (factorySettingsHash == keccak256(abi.encodePacked("bulldozerF"))) {
   
        depot.bulldozerAmount += 1;
        if (depot.bulldozerAmount > 200) {
            
			 break;// Ограничиваем максимум
        }
   
}



				else {
                    cell.componentsAmount += 10;
                    break;
                }
            }
        }
    }

    // Обновление mainGrid с обновленными данными ячеек
    function _updateMainGrid(
        address user,
        uint256[] memory indices,
        IMainGrid.Cell[] memory updatedCells,
        bool[] memory isUpdated,
        uint256 gridSize,
        uint256 totalCells
    ) internal {
        for (uint256 iter = 0; iter < totalCells; iter++) {
            if (isUpdated[iter]) {
                uint256 index = indices[iter];
                (uint256 x, uint256 y) = _getCoordinates(index, gridSize);
                IMainGrid.Cell memory cell = updatedCells[iter];

                mainGrid.updateCoalAmount(user, x, y, cell.coalAmount);
                mainGrid.updateIronAmount(user, x, y, cell.ironAmount);
                mainGrid.updateIronplateAmount(user, x, y, cell.ironplateAmount);
                mainGrid.updateComponentsAmount(user, x, y, cell.componentsAmount);
                mainGrid.updateLastTimeChecked(user, x, y, cell.lastTimeChecked);
            }
        }
    }

    // Обновление количеств в депо
    function _updateDepotAmounts(address user, IMainGrid.Depot memory depot) internal {
        mainGrid.updateDepotDrillsAmount(user, depot.drillsAmount);
        mainGrid.updateDepotBoxesAmount(user, depot.boxesAmount);
        mainGrid.updateDepotMansAmount(user, depot.mansAmount);
        mainGrid.updateDepotFurnaceAmount(user, depot.furnaceAmount);
        mainGrid.updateDepotBulldozerAmount(user, depot.bulldozerAmount);
        mainGrid.updateDepotFactoryAmount(user, depot.factoryAmount);
		mainGrid.updateDepotWallAmount(user, depot.wallAmount); // Добавляем обновление стен
		
    }


























































}
//BBB