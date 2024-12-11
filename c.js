// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8 .0;
contract SimpleGrid {
    // Define the grid size
    uint256 public constant gridSize = 10; // Размер сетки 10x10
    uint256 public constant oreProbability = 15; // Вероятность появления угля (в процентах)
    //uint256 public constant MaxBox = 2000; // Максимум угля в буре
    uint256 public constant MaxBox = 4000; // Максимум угля в ящике
    uint256 mtime = 600;
    struct Cell {
        string content; // "Coal", "contentEmpty", "Iron", "Space";
        string tool; // "Drill", "Box", "Man", "Furnace", "Factory", "toolEmpty";
        uint256 coalAmount;
		uint256 lastTimeChecked;
        string man; // "LR" или "RL" или "UD" или "DU" или "manEmpty";
        uint256 ironAmount;
        uint256 ironplateAmount;
        uint256 componentsAmount;
		string factorySettings; // "drillsF", "boxesF", "mansF", "furnaceF", "factoryF", "bulldozerF", "componentsF", "factorySettingsEmptyF", "",
    }
    struct Grid {
        Cell[gridSize][gridSize] cells;
    }
    struct Depot {
        uint256 drillsAmount; // Количество дрелей
        uint256 boxesAmount; // Количество ящиков
        uint256 mansAmount; // Количество манипуляторов
        uint256 furnaceAmount; // Количество манипуляторов
        uint256 factoryAmount; // Количество заводов
        uint256 starttimee;
        uint256 lastmeteoritTimeChecked;
        uint256 blocktimestamp;
        uint256 bulldozerAmount;
    }
    mapping(address => Grid) private grids;
    mapping(address => Depot) private depots;


    function initializeGrid() external {
        Grid storage grid = grids[msg.sender];
        for (uint256 x = 0; x < gridSize; x++) {
            for (uint256 y = 0; y < gridSize; y++) {
                uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100;
                if (random < (oreProbability * 2 ) && 1>0 ) { // nu a cho
                    if (random < oreProbability) {
                        grid.cells[x][y] = Cell("Iron", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF");
                    } else {
                        grid.cells[x][y] = Cell("Coal", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF");
                    }
                } else {
                    grid.cells[x][y] = Cell("Space", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF");
                }
            }
        }

        depots[msg.sender] = Depot(50, 50, 50, 50, 50, block.timestamp, 0, block.timestamp, 50);

    }


    function getCell(uint256 x, uint256 y) external view returns(Cell memory) {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        return grids[msg.sender].cells[x][y];
    }

    function getDepot() external view returns(Depot memory) {
        return depots[msg.sender];
    }

    function starttimeeUpdate(uint256 decrementValue) external {
        Depot storage depot = depots[msg.sender];
        require(decrementValue <= depot.lastmeteoritTimeChecked, "Decrement value exceeds starttimee");
        require(decrementValue <= 1733874056, "max 100000");
        depot.lastmeteoritTimeChecked -= decrementValue;
    }



		//string factorySettings; // "drillsF", "boxesF", "mansF", "furnaceF", "factoryF", "bulldozerF", "componentsF", "factorySettingsEmptyF", "",




    function factorySettingsUpdate(uint256 x, uint256 y, string memory factorySettingsType) external {
        Grid storage grid = grids[msg.sender];
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("drillsF"))) {
            grid.cells[x][y].factorySettings = "drillsF";
        } else		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("boxesF"))) {
            grid.cells[x][y].factorySettings = "boxesF";
        } else		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("mansF"))) {
            grid.cells[x][y].factorySettings = "mansF";
        } else		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("furnaceF"))) {
            grid.cells[x][y].factorySettings = "furnaceF";
        } else		
		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("factoryF"))) {
            grid.cells[x][y].factorySettings = "factoryF";
        } else		
		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("bulldozerF"))) {
            grid.cells[x][y].factorySettings = "bulldozerF";
        } else		
		
		
        if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("componentsF"))) {
            grid.cells[x][y].factorySettings = "componentsF";
        }	

    }



    function placeDrill(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.drillsAmount > 0, "No drills available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("contentEmpty")), "No ore to drill");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        grid.cells[x][y].tool = "Drill";
        grid.cells[x][y].lastTimeChecked = block.timestamp;
        depot.drillsAmount--;
    }

    function placeBox(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.boxesAmount > 0, "No boxes available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        grid.cells[x][y].tool = "Box";
        depot.boxesAmount--;
    }

    function placeManLR(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.mansAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Man";
        grid.cells[x][y].man = "LR";
        depot.mansAmount--;
    }

    function placeManRL(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.mansAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Man";
        grid.cells[x][y].man = "RL";
        depot.mansAmount--;
    }

    function placeManDU(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.mansAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Man";
        grid.cells[x][y].man = "DU";
        depot.mansAmount--;
    }

    function placeManUD(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.mansAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Man";
        grid.cells[x][y].man = "UD";
        depot.mansAmount--;
    }

    function placeFurnace(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.furnaceAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Furnace";
        depot.furnaceAmount--;
    }

    function placeFactory(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.factoryAmount > 0, "No mansAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
        grid.cells[x][y].tool = "Factory";
        depot.factoryAmount--;
    }

    function removeTool(uint256 x, uint256 y) public {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        Depot storage depot = depots[msg.sender]; // Доступ к депо пользователя
        //require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) != keccak256(abi.encodePacked("toolEmpty")), "Not Tool");
        // Проверка и обновление депо в зависимости от типа инструмента
        string memory toolType = grid.cells[x][y].tool;
        if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Drill"))) {
            depot.drillsAmount += 1;
        } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Box"))) {
            depot.boxesAmount += 1;
        } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Man"))) {
            depot.mansAmount += 1;
        } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Furnace"))) {
            depot.furnaceAmount += 1;
        } else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Factory"))) {
            depot.factoryAmount += 1;
        }
        // Удаление инструмента
        grid.cells[x][y].man = "manEmpty";
        grid.cells[x][y].tool = "toolEmpty";
        grid.cells[x][y].coalAmount = 0;
        grid.cells[x][y].ironAmount = 0;
        grid.cells[x][y].ironplateAmount = 0;
    }

    function placeBulldozer(uint256 x, uint256 y) external {
        Depot storage depot = depots[msg.sender];
        require((block.timestamp - depot.lastmeteoritTimeChecked) < mtime, "Error. Please wait for synchronization first.");
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(depot.bulldozerAmount > 0, "No bulldozerAmount available");
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Space")), "NotSpace");
        depot.bulldozerAmount--;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100;

        if (random < (oreProbability * 2)) {
            if (random < oreProbability) {
                grid.cells[x][y].content = "Iron";
            } else {
                grid.cells[x][y].content = "Coal";
            }
        } else {
            grid.cells[x][y].content = "contentEmpty";
        }
    }

    function meteoritfunction() public {
        Depot storage depot = depots[msg.sender]; 
        require((block.timestamp - depot.lastmeteoritTimeChecked) > mtime, "randommeteorit < mtime");
        bool didmeteorit = false;
        Grid storage grid = grids[msg.sender];
     
       uint256 iterationLimit = 173; // 1733874811
        uint256 iterationCount = 0;
        while (block.timestamp - depot.lastmeteoritTimeChecked > mtime && iterationCount < iterationLimit) {
			uint256 k = 0;
		    for (uint256 m = 0; m < gridSize; m++) {
            for (uint256 n = 0; n < gridSize; n++) {
				if (keccak256(abi.encodePacked(grid.cells[m][n].content)) == keccak256(abi.encodePacked("Space"))){
					k++;
				}
			}
			}
			
			if (k == gridSize * gridSize){

				depot.lastmeteoritTimeChecked = block.timestamp-1-mtime;
             
			}
            uint256 i = depot.lastmeteoritTimeChecked * mtime; 
            uint256 x = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % gridSize;
            uint256 y = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, i))) % gridSize;
            depot.lastmeteoritTimeChecked += mtime;
            if (keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space"))) {

                didmeteorit = true;
                //дальше рушим ячейку
                string memory toolType = grid.cells[x][y].tool;
                if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Drill"))) {
                    depot.drillsAmount -= 1;
                }
                if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Box"))) {
                    depot.boxesAmount -= 1;
                }
                if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Man"))) {
                    depot.mansAmount -= 1;
                }
                if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Furnace"))) {
                    depot.furnaceAmount -= 1;
                }
                if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Factory"))) {
                    depot.factoryAmount -= 1;
                }
                // Удаление инструмента
                grid.cells[x][y].man = "manEmpty";
                grid.cells[x][y].tool = "toolEmpty";
                grid.cells[x][y].coalAmount = 0;
                grid.cells[x][y].ironAmount = 0;
                grid.cells[x][y].ironplateAmount = 0;
                grid.cells[x][y].content = "Space";
            }
            iterationCount++;
        }
        depot.blocktimestamp = block.timestamp;
    }

    function transferResourses(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
        if (fromX >= 0 && fromX < gridSize && fromY >= 0 && fromY < gridSize && toX >= 0 && toX < gridSize && toY >= 0 && toY < gridSize) {
            transferCoal(fromX, fromY, toX, toY); 
            transferIron(fromX, fromY, toX, toY); // Передаем координаты источника и цели
            transferIronPlate(fromX, fromY, toX, toY); // Передаем координаты источника и цели
            transferComponents(fromX, fromY, toX, toY); // Передаем координаты источника и цели
        }
    }

    function transferCoal(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
        Grid storage grid = grids[msg.sender];
        Cell storage source = grid.cells[fromX][fromY];
        Cell storage destination = grid.cells[toX][toY];
        if ((keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("toolEmpty"))) && (keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("Factory")))) {
            uint256 resourceToMove = source.coalAmount;
            uint256 availableSpaceInBoxAll = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
            uint256 availableSpaceInBox = availableSpaceInBoxAll - destination.ironAmount - destination.ironplateAmount - destination.componentsAmount;
            uint256 resourceTransferred = 0;
            if (resourceToMove > availableSpaceInBox) {
                destination.coalAmount = availableSpaceInBox;
            } else {
                resourceTransferred = resourceToMove;
                destination.coalAmount += resourceToMove;
            }
            source.coalAmount -= resourceTransferred;
        }
    }

    function transferIron(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
        Grid storage grid = grids[msg.sender];
        Cell storage source = grid.cells[fromX][fromY];
        Cell storage destination = grid.cells[toX][toY];
        if ((keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("toolEmpty"))) && (keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("Factory")))) {
            uint256 resourceToMove = source.ironAmount;
            uint256 availableSpaceInBoxAll = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
            uint256 availableSpaceInBox = availableSpaceInBoxAll - destination.ironplateAmount - destination.componentsAmount- destination.coalAmount;
            uint256 resourceTransferred = 0;
            if (resourceToMove > availableSpaceInBox) {
                destination.ironAmount = availableSpaceInBox;
            } else {
                resourceTransferred = resourceToMove;
                destination.ironAmount += resourceToMove;
            }
            source.ironAmount -= resourceTransferred;
        }
    }

    function transferIronPlate(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
        Grid storage grid = grids[msg.sender];
        Cell storage source = grid.cells[fromX][fromY];
        Cell storage destination = grid.cells[toX][toY];
        if ((keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Factory"))) || (keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")))) {
            uint256 resourceToMove = source.ironplateAmount;
            uint256 availableSpaceInBoxAll = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
            uint256 availableSpaceInBox = availableSpaceInBoxAll - destination.ironAmount - destination.componentsAmount- destination.coalAmount;
            uint256 resourceTransferred = 0;
            if (resourceToMove > availableSpaceInBox) {
                destination.ironplateAmount = availableSpaceInBox;
            } else {
                resourceTransferred = resourceToMove;
                destination.ironplateAmount += resourceToMove;
            }
            source.ironplateAmount -= resourceTransferred;
        }
    }
	
    function transferComponents(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
        Grid storage grid = grids[msg.sender];
        Cell storage source = grid.cells[fromX][fromY];
        Cell storage destination = grid.cells[toX][toY];
        if ((keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Factory"))) || (keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")))) {
            uint256 resourceToMove = source.componentsAmount;
            uint256 availableSpaceInBoxAll = MaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
            uint256 availableSpaceInBox = availableSpaceInBoxAll - destination.ironAmount - destination.ironplateAmount - destination.coalAmount;
            uint256 resourceTransferred = 0;
            if (resourceToMove > availableSpaceInBox) {
                destination.componentsAmount = availableSpaceInBox;
            } else {
                resourceTransferred = resourceToMove;
                destination.componentsAmount += resourceToMove;
            }
            source.componentsAmount -= resourceTransferred;
        }
    }	
	






function updateCoal() public {
	meteoritfunction();
    Grid storage grid = grids[msg.sender];
    Depot storage depot = depots[msg.sender]; // Доступ к депо пользователя
    uint256 totalCells = gridSize * gridSize;
    uint256[] memory indices = new uint256[](totalCells);

    // Инициализируем массив индексов
    for (uint256 i = 0; i < totalCells; i++) {
        indices[i] = i;
    }

    // Перемешиваем индексы (алгоритм Fisher-Yates)
    for (uint256 i = totalCells - 1; i > 0; i--) {
        uint256 j = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (i + 1);
        (indices[i], indices[j]) = (indices[j], indices[i]);
    }

    // Обрабатываем `totalCells` случайных клеток
    for (uint256 iter = 0; iter < totalCells; iter++) {
        uint256 index = indices[iter];
        uint256 x = index % gridSize; // Координата x
        uint256 y = index / gridSize; // Координата y
		

		

        Cell storage cell = grid.cells[x][y];
		
		
		
		
		                bytes32 manType = keccak256(abi.encodePacked(cell.man));
                if (manType != keccak256(abi.encodePacked("manEmpty"))) {
                    if (manType == keccak256(abi.encodePacked("LR"))) {
                        transferResourses(x - 1, y, x + 1, y); // Передаем координаты источника и цели
                    } else if (manType == keccak256(abi.encodePacked("RL"))) {
                        transferResourses(x + 1, y, x - 1, y); // Передаем координаты источника и цели
                    } else if (manType == keccak256(abi.encodePacked("UD"))) {
                        transferResourses(x, y + 1, x, y - 1); // Передаем координаты источника и цели
                    } else if (manType == keccak256(abi.encodePacked("DU"))) {
                        transferResourses(x, y - 1, x, y + 1); // Передаем координаты источника и цели
                    }
                }




            //uint256 randomValue = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100 + 1;
            if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Drill")) && keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Coal"))) {
                uint256 secondsPassed = block.timestamp - cell.lastTimeChecked; // Или другая логика для подсчёта времени
                uint256 minedCoal = secondsPassed; // Пример: 1 угля за каждую секунду
                grid.cells[x][y].lastTimeChecked = block.timestamp;
                // Обновляем уголь на клетке
                grid.cells[x][y].coalAmount += minedCoal;
                if (grid.cells[x][y].coalAmount > MaxBox) {
                    grid.cells[x][y].coalAmount = MaxBox;
                }
            }




            if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Drill")) && keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Iron"))) {
                uint256 secondsPassed = block.timestamp - cell.lastTimeChecked; // Или другая логика для подсчёта времени
                uint256 minedIron = secondsPassed; // Пример: 1 угля за каждую секунду
                grid.cells[x][y].lastTimeChecked = block.timestamp;
                // Обновляем уголь на клетке
                grid.cells[x][y].ironAmount += minedIron;
                if (grid.cells[x][y].ironAmount > MaxBox) {
                    grid.cells[x][y].ironAmount = MaxBox;
                }
            }




            if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Furnace")) && grid.cells[x][y].coalAmount >= 10 && grid.cells[x][y].ironAmount >= 10) {
                // Если угля и железа достаточно для создания 1 плиты
                while (grid.cells[x][y].coalAmount >= 10 && grid.cells[x][y].ironAmount >= 10) {
                    grid.cells[x][y].coalAmount -= 10; // Израсходуем 10 угля
                    grid.cells[x][y].ironAmount -= 10; // Израсходуем 10 железа
                    grid.cells[x][y].ironplateAmount += 1; // Производим 1 железную пластину
                }
            }


            if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("componentsF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].ironplateAmount >= 10) {
                    grid.cells[x][y].ironplateAmount -= 10;
                    grid.cells[x][y].componentsAmount += 1;
                }
            }
			
			
			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("drillsF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.drillsAmount += 1;
                }
            }

			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("boxesF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.boxesAmount += 1;
                }
            }
			
			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("mansF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.mansAmount += 1;
                }
            }
			
			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("furnaceF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.furnaceAmount += 1;
                }
            }
			
			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("factoryF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.factoryAmount += 1;
                }
            }
			
			
			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("bulldozerF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
                while (grid.cells[x][y].componentsAmount >= 10) {
                    grid.cells[x][y].componentsAmount -= 10;
                    depot.bulldozerAmount += 1;
                }
            }
        }
    }






}