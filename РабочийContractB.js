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
	}

	function getCell(address user, uint256 x, uint256 y) external view returns(Cell memory);


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
	}

	function getMaxBox() external view returns(uint256);

	function getDepot(address user) external view returns(Depot memory);

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

	function updateDepotiterationLimitDepot(address user, uint256 mmmdrillSpeed) external;


}

contract ContractBBB {
	IMainGrid private mainGrid;
	address public admin;
	uint256 public constant oreProbability = 20;

	// События
	event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
	event MainGridAddressChanged(address indexed oldAddress, address indexed newAddress);

	// Модификатор для ограничения доступа администратору
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

	function transferResourses(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		// Проверяем координаты
		IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);
		require(fromX < depot.gridSize && fromY < depot.gridSize, "Invalid source coordinates");
		require(toX < depot.gridSize && toY < depot.gridSize, "Invalid destination coordinates");

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
			keccak256(abi.encodePacked(destination.factorySettings)) == keccak256(abi.encodePacked("componentsF")) ||
			keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box"))
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
			) || keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box"))
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





	event Debug(string message, uint256 value);
 // События для отладки и отслеживания
    event MeteoriteImpacted(string direction, uint256 x, uint256 y);
    event MeteoritePlaced(uint256 x, uint256 y);

    // Константы направлений
    enum Direction { UP, RIGHT, DOWN, LEFT }

    // Нонс для генерации случайных чисел
    uint256 private nonce;


	
	
	
// Функция выбора случайной ячейки
function selectRandomCell(uint256 gridSize) private view returns (uint256, uint256) {
    // Генерация псевдослучайного числа для X
    uint256 randomSeedX = uint256(
        keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, block.number)
        )
    );
    uint256 startX = randomSeedX % gridSize;

    // Генерация псевдослучайного числа для Y
    uint256 randomSeedY = uint256(
        keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, block.number, startX)
        )
    );
    uint256 startY = randomSeedY % gridSize;

    return (startX, startY);
}	
	
// Основная функция обработки метеорита
function meteoritfunction() public {
    IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);
    uint256 gridSize = depot.gridSize;

    require(gridSize > 0, "Grid size is not initialized");
    emit Debug("Grid size initialized", gridSize);

    if (block.timestamp - depot.lastmeteoritTimeChecked > depot.mmmtime) {
        emit Debug("Condition for meteorit event met", block.timestamp);

        // Шаг 1: Выбор случайной целевой ячейки
        (uint256 targetX, uint256 targetY) = selectRandomCell(gridSize);
        emit Debug("Target cell selected", targetX * gridSize + targetY);

        // Шаг 2: Выбор случайной стороны для начала движения
        Direction edgeDirection = selectRandomEdgeDirection();
        emit Debug("Starting edge direction selected", uint256(edgeDirection));

        // Шаг 3: Вычисление начальной позиции метеорита на выбранной стороне
        (uint256 startX, uint256 startY) = getEdgeStartPosition(edgeDirection, gridSize);
        emit Debug("Starting edge position", startX * gridSize + startY);

        // Шаг 4: Движение метеорита внутрь сетки
        moveMeteorite(startX, startY, gridSize, depot);

        // Обновляем временные метки депо
        depot.lastmeteoritTimeChecked += depot.mmmtime;
    }

    mainGrid.updateDepotBlockTimestamp(msg.sender, block.timestamp);
    mainGrid.updateDepotEarly(msg.sender, block.timestamp - depot.lastmeteoritTimeChecked);
}

// Получение стартовой позиции на краю сетки
function getEdgeStartPosition(Direction edgeDirection, uint256 gridSize)
    private
    view
    returns (uint256, uint256)
{
    if (edgeDirection == Direction.UP) {
        return (0, uint256(keccak256(abi.encodePacked(block.timestamp))) % gridSize); // Верхняя сторона
    } else if (edgeDirection == Direction.RIGHT) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp))) % gridSize, gridSize - 1); // Правая сторона
    } else if (edgeDirection == Direction.DOWN) {
        return (gridSize - 1, uint256(keccak256(abi.encodePacked(block.timestamp))) % gridSize); // Нижняя сторона
    } else {
        return (uint256(keccak256(abi.encodePacked(block.timestamp))) % gridSize, 0); // Левая сторона
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

        emit Debug("Checking cell", currentX * gridSize + currentY);

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





// Выбор случайной стороны для начала движения
function selectRandomEdgeDirection() private view returns (Direction) {
    uint256 randDir = uint256(
        keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender
            )
        )
    ) % 4;

    return Direction(randDir); // UP, RIGHT, DOWN, LEFT
}


function handleMeteoriteImpact(uint256 x, uint256 y, IMainGrid.Depot memory depot) internal {



				IMainGrid.Cell memory cell = mainGrid.getCell(msg.sender, x, y);

				
					string memory toolType = cell.tool;

					// Обновляем данные депо в зависимости от типа инструмента
					if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Drill"))) {
						mainGrid.updateDepotDrillsAmount(msg.sender, depot.drillsAmount - 1);
					}
					if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Box"))) {
						mainGrid.updateDepotBoxesAmount(msg.sender, depot.boxesAmount - 1);
					}
					if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Man"))) {
						mainGrid.updateDepotMansAmount(msg.sender, depot.mansAmount - 1);
					}
					if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Furnace"))) {
						mainGrid.updateDepotFurnaceAmount(msg.sender, depot.furnaceAmount - 1);
					}
					if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Factory"))) {
						mainGrid.updateDepotFactoryAmount(msg.sender, depot.factoryAmount - 1);
					}

					// Обновляем данные ячейки через основной контракт
					mainGrid.updateMan(msg.sender, x, y, "manEmpty");
					mainGrid.updateCoalAmount(msg.sender, x, y, 0);
					mainGrid.updateIronAmount(msg.sender, x, y, 0);
					mainGrid.updateIronplateAmount(msg.sender, x, y, 0);
					mainGrid.updateComponentsAmount(msg.sender, x, y, 0);
					mainGrid.updateFactorySettings(msg.sender, x, y, "factorySettingsEmptyF");

					if (
						keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Space")) &&
						keccak256(abi.encodePacked(toolType)) != keccak256(abi.encodePacked("Ruins"))
					)

					{

if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("toolEmpty"))) {

							mainGrid.updateTool(msg.sender, x, y, "Space");
						}
						else {
							mainGrid.updateTool(msg.sender, x, y, "Ruins");
						}


					}
	}
			

		

	







	




	function updateCoal() public {

		uint256 MaxBox = mainGrid.getMaxBox();

		// Получаем данные депо и размер сетки через основной контракт
		IMainGrid.Depot memory depot = mainGrid.getDepot(msg.sender);
		uint256 gridSize = depot.gridSize;

		// Обновляем временные метки
		mainGrid.updateDepotBlockTimestamp(msg.sender, block.timestamp);
		if (block.timestamp - depot.lastmeteoritTimeChecked > depot.mmmtime) {
			meteoritfunction(); // Вызываем метеоритную функцию, если необходимо
		}

		uint256 totalCells = gridSize * gridSize;
		uint256[] memory indices = new uint256[](totalCells);

		// Генерируем массив индексов
		for (uint256 i = 0; i < totalCells; i++) {
			indices[i] = i;
		}

		// Перемешиваем индексы
		for (uint256 i = totalCells - 1; i > 0; i--) {
			uint256 j = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (i + 1);
			(indices[i], indices[j]) = (indices[j], indices[i]);
		}

		for (uint256 iter = 0; iter < totalCells; iter++) {
			uint256 index = indices[iter];
			uint256 x = index % gridSize;
			uint256 y = index / gridSize;

			IMainGrid.Cell memory cell = mainGrid.getCell(msg.sender, x, y);

			bytes32 manType = keccak256(abi.encodePacked(cell.man));

			if (manType != keccak256(abi.encodePacked("manEmpty"))) {
				// Обрабатываем манипуляторы
				if (manType == keccak256(abi.encodePacked("LR"))) {
					transferResourses(x - 1, y, x + 1, y);
				}
				else if (manType == keccak256(abi.encodePacked("RL"))) {
					transferResourses(x + 1, y, x - 1, y);
				}
				else if (manType == keccak256(abi.encodePacked("UD"))) {
					transferResourses(x, y + 1, x, y - 1);
				}
				else if (manType == keccak256(abi.encodePacked("DU"))) {
					transferResourses(x, y - 1, x, y + 1);
				}
			}

			bytes32 toolHash = keccak256(abi.encodePacked(cell.tool));
			bytes32 contentHash = keccak256(abi.encodePacked(cell.content));

			// Обработка буров
			if (toolHash == keccak256(abi.encodePacked("Drill")) && contentHash == keccak256(abi.encodePacked("Coal"))) {
				uint256 newCoalAmount = cell.coalAmount + (block.timestamp - cell.lastTimeChecked) * depot.mmmdrillSpeed;
				newCoalAmount = newCoalAmount > MaxBox ? MaxBox : newCoalAmount;
				mainGrid.updateCoalAmount(msg.sender, x, y, newCoalAmount);
				mainGrid.updateLastTimeChecked(msg.sender, x, y, block.timestamp);
			}

			if (toolHash == keccak256(abi.encodePacked("Drill")) && contentHash == keccak256(abi.encodePacked("Iron"))) {
				uint256 newIronAmount = cell.ironAmount + (block.timestamp - cell.lastTimeChecked) * depot.mmmdrillSpeed;
				newIronAmount = newIronAmount > MaxBox ? MaxBox : newIronAmount;
				mainGrid.updateIronAmount(msg.sender, x, y, newIronAmount);
				mainGrid.updateLastTimeChecked(msg.sender, x, y, block.timestamp);
			}

			// Обработка печей
			if (toolHash == keccak256(abi.encodePacked("Furnace")) && cell.coalAmount >= 10 && cell.ironAmount >= 10) {
				uint256 coalUsed = 10;
				uint256 ironUsed = 10;
				uint256 ironPlateProduced = 1;

				while (cell.coalAmount >= coalUsed && cell.ironAmount >= ironUsed) {
					cell.coalAmount -= coalUsed;
					cell.ironAmount -= ironUsed;
					cell.ironplateAmount += ironPlateProduced;
				}

				mainGrid.updateCoalAmount(msg.sender, x, y, cell.coalAmount);
				mainGrid.updateIronAmount(msg.sender, x, y, cell.ironAmount);
				mainGrid.updateIronplateAmount(msg.sender, x, y, cell.ironplateAmount);
			}

			// Обработка фабрик
			if (
				toolHash == keccak256(abi.encodePacked("Factory")) &&
				keccak256(abi.encodePacked(cell.factorySettings)) == keccak256(abi.encodePacked("componentsF")) &&
				cell.ironplateAmount >= 10
			) {
				while (cell.ironplateAmount >= 10) {
					cell.ironplateAmount -= 10;
					cell.componentsAmount += 1;
				}

				mainGrid.updateIronplateAmount(msg.sender, x, y, cell.ironplateAmount);
				mainGrid.updateComponentsAmount(msg.sender, x, y, cell.componentsAmount);
			}

			// Производство на основе factorySettings
			if (toolHash == keccak256(abi.encodePacked("Factory")) && cell.componentsAmount >= 10) {
				bytes32 factorySettingsHash = keccak256(abi.encodePacked(cell.factorySettings));

				while (cell.componentsAmount >= 10) {
					cell.componentsAmount -= 10;

					if (factorySettingsHash == keccak256(abi.encodePacked("drillsF"))) {
						depot.drillsAmount += 1;
					}
					else if (factorySettingsHash == keccak256(abi.encodePacked("boxesF"))) {
						depot.boxesAmount += 1;
					}
					else if (factorySettingsHash == keccak256(abi.encodePacked("mansF"))) {
						depot.mansAmount += 1;
					}
					else if (factorySettingsHash == keccak256(abi.encodePacked("furnaceF"))) {
						depot.furnaceAmount += 1;
					}
					else if (factorySettingsHash == keccak256(abi.encodePacked("factoryF"))) {
						depot.factoryAmount += 1;
					}
					else if (factorySettingsHash == keccak256(abi.encodePacked("bulldozerF"))) {
						depot.bulldozerAmount += 1;
					}
					else {
						cell.componentsAmount += 10; // Возвращаем компоненты при неизвестной настройке
						break;
					}
				}

				mainGrid.updateComponentsAmount(msg.sender, x, y, cell.componentsAmount);
				mainGrid.updateDepotDrillsAmount(msg.sender, depot.drillsAmount);
				mainGrid.updateDepotBoxesAmount(msg.sender, depot.boxesAmount);
				mainGrid.updateDepotMansAmount(msg.sender, depot.mansAmount);
				mainGrid.updateDepotFurnaceAmount(msg.sender, depot.furnaceAmount);
				mainGrid.updateDepotFactoryAmount(msg.sender, depot.factoryAmount);
				mainGrid.updateDepotBulldozerAmount(msg.sender, depot.bulldozerAmount);
			}
		}
	}


















}