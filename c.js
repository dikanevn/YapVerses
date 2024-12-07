// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleGrid {
    // Define the grid size
    uint256 public constant gridSize = 10;  // Размер сетки 10x10
	uint256 public oreProbability = 10; // Вероятность появления угля (в процентах)
    uint256 public constant MaxDrill = 200; // Максимум угля в буре
    uint256 public constant MaxBox = 400;   // Максимум угля в ящике
 
    struct Cell {
        string content; // "Ore" или "Empty"
        bool drill;
        bool box;
        uint256 coalAmount;
        uint256 lastBlockChecked;
		string man; // "LR" или "RL" или "UD" или "DU" или "Empty"
    }

    struct Grid {
        Cell[gridSize][gridSize] cells;
    }

    mapping(address => Grid) private grids;


    event OrePlaced(address indexed player, uint256 x, uint256 y);
    event OreRemoved(address indexed player, uint256 x, uint256 y);
    event DrillPlaced(address indexed player, uint256 x, uint256 y);
    event DrillRemoved(address indexed player, uint256 x, uint256 y);
	event BoxPlaced(address indexed player, uint256 x, uint256 y);
    event BoxRemoved(address indexed player, uint256 x, uint256 y);
    event CoalUpdated(address indexed player, uint256 x, uint256 y, uint256 amount);
	event ManPlasedLR(address indexed player, uint256 x, uint256 y); 
	event ManPlasedRL(address indexed player, uint256 x, uint256 y);
	event ManPlasedUD(address indexed player, uint256 x, uint256 y);
	event ManPlasedDU(address indexed player, uint256 x, uint256 y);
    event ManRemoved(address indexed player, uint256 x, uint256 y);	
	
	
    function initializeGrid() external {
        Grid storage grid = grids[msg.sender];
        for (uint256 x = 0; x < gridSize; x++) {
            for (uint256 y = 0; y < gridSize; y++) {
                uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100;
                if (random < oreProbability) {
                    grid.cells[x][y] = Cell("Ore", false, false, 0, block.number, "Empty");
                } else {
                    grid.cells[x][y] = Cell("Empty", false, false, 0, block.number, "Empty");
                }
            }
        }
    }


    function getCell(uint256 x, uint256 y) external view returns (Cell memory) {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        return grids[msg.sender].cells[x][y];
    }

    function placeOre(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Empty")), "Cell is not empty");
        grid.cells[x][y].content = "Ore";
        emit OrePlaced(msg.sender, x, y);
    }

    // Function to remove ore
    function removeOre(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Ore")), "No ore to remove");
        grid.cells[x][y].content = "Empty";
        emit OreRemoved(msg.sender, x, y);
    }


    function placeDrill(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Ore")), "No ore to drill");
        require(!grid.cells[x][y].drill, "Drill already placed");
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Man already installed");
		
        grid.cells[x][y].drill = true;
        grid.cells[x][y].lastBlockChecked = block.number;
        emit DrillPlaced(msg.sender, x, y);
    }


    // Function to remove a drill from a cell
    function removeDrill(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
        require(grid.cells[x][y].drill, "No drill to remove");

        grid.cells[x][y].drill = false;
		grid.cells[x][y].coalAmount = 0;
        emit DrillRemoved(msg.sender, x, y);
    }

    function placeBox(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(!grid.cells[x][y].drill, "Drill already placed");
        require(!grid.cells[x][y].box, "Box already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Man already installed");

        grid.cells[x][y].box = true;
        emit BoxPlaced(msg.sender, x, y);
    }

	function removeBox(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid cell coordinates");
		Grid storage grid = grids[msg.sender];

        require(grid.cells[x][y].box, "No box to remove");

        grid.cells[x][y].box = false;
		grid.cells[x][y].coalAmount = 0;
        emit BoxRemoved(msg.sender, x, y);
    }
	
    function placeManLR(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Not Empty");
		require(!grid.cells[x][y].drill, "Drill already placed");
        require(!grid.cells[x][y].box, "Box already placed");
        grid.cells[x][y].man = "LR";
        emit ManPlasedLR(msg.sender, x, y);
    }	

    function placeManRL(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Not Empty");
		require(!grid.cells[x][y].drill, "Drill already placed");
        require(!grid.cells[x][y].box, "Box already placed");
        grid.cells[x][y].man = "RL";
        emit ManPlasedRL(msg.sender, x, y);
    }	

    function placeManUD(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Not Empty");
		require(!grid.cells[x][y].drill, "Drill already placed");
        require(!grid.cells[x][y].box, "Box already placed");
        grid.cells[x][y].man = "UD";
        emit ManPlasedUD(msg.sender, x, y);
    }

    function placeManDU(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) == keccak256(abi.encodePacked("Empty")), "Not Empty");
		require(!grid.cells[x][y].drill, "Drill already placed");
        require(!grid.cells[x][y].box, "Box already placed"); 
		grid.cells[x][y].man = "DU";
        emit ManPlasedDU(msg.sender, x, y);
    }

    function removeMan(uint256 x, uint256 y) external {
        require(x < gridSize && y < gridSize, "Invalid coordinates");
        Grid storage grid = grids[msg.sender];
        require(keccak256(abi.encodePacked(grid.cells[x][y].man)) != keccak256(abi.encodePacked("Empty")), "Empty already installed");
        grid.cells[x][y].man = "Empty";
        emit ManRemoved(msg.sender, x, y);
    }
	
	
	function updateCoal() external {
		Grid storage grid = grids[msg.sender];

	for (uint256 p = 0; p < 2; p++) {	
        for (uint256 x = 0; x < gridSize; x++) {
            for (uint256 y = 0; y < gridSize; y++) {
				 Cell storage cell = grid.cells[x][y];

				// Первый круг: если есть бур, добываем уголь
				if (cell.drill && keccak256(abi.encodePacked(cell.content)) == keccak256(abi.encodePacked("Ore"))) {					
                    uint256 blocksPassed = block.number - cell.lastBlockChecked; // Или другая логика для подсчёта времени
                    uint256 minedCoal = blocksPassed * 10; // Пример: 10 угля за каждый блок
					cell.lastBlockChecked = block.number;
                    // Обновляем уголь на клетке
                    cell.coalAmount+= minedCoal;
					if (cell.coalAmount > MaxDrill) {
						cell.coalAmount = MaxDrill;
					}	
                    // Эмиттируем событие обновления угля
                    emit CoalUpdated(msg.sender, x, y, cell.coalAmount);
				}
			}
		}
	}
	}
	
	
	
	function transport() external {
		Grid storage grid = grids[msg.sender];
					     updateCoal();
	for (uint256 p = 0; p < 2; p++) {	
        for (uint256 x = 0; x < gridSize; x++) {
            for (uint256 y = 0; y < gridSize; y++) {
				 Cell storage cell = grid.cells[x][y];

                if (keccak256(abi.encodePacked(grid.cells[x][y].man)) != keccak256(abi.encodePacked("Empty"))












				// Второй круг: проверяем наличие бокса рядом с буром
	            if (cell.box) {

                if (x > 0 && grid.cells[x - 1][y].drill) {  // Сосед слева
                    uint256 coalToMove = grid.cells[x - 1][y].coalAmount;
                    uint256 availableSpaceInBox = MaxBox - grid.cells[x][y].coalAmount; // Пространство в ящике
                    uint256 coalTransferred = 0;

                    // Переносим уголь в бокс, но не больше доступного места
                    if (coalToMove > availableSpaceInBox) {
                        coalTransferred = availableSpaceInBox;
                        grid.cells[x][y].coalAmount = MaxBox; // Заполняем бокс до MaxBox
                    } else {
                        coalTransferred = coalToMove;
                        grid.cells[x][y].coalAmount += coalToMove;  // Переносим весь уголь, если хватает места
                    }

                    // Обновляем количество угля в буре
                    grid.cells[x - 1][y].coalAmount -= coalTransferred;

                    // Если в буре осталось угля, мы заполним его до максимума
                    if (grid.cells[x - 1][y].coalAmount > MaxDrill) {
                        grid.cells[x - 1][y].coalAmount = MaxDrill;
                    }

                    // Эмиттируем событие для бокса и буры
                    emit CoalUpdated(msg.sender, x, y, grid.cells[x][y].coalAmount);
                    emit CoalUpdated(msg.sender, x - 1, y, grid.cells[x - 1][y].coalAmount);
                }
				// Повторяем для других соседей (справа, сверху, снизу)...
                if (x < gridSize - 1 && grid.cells[x + 1][y].drill) {  // Сосед справа
                    uint256 coalToMove = grid.cells[x + 1][y].coalAmount;
                    uint256 availableSpaceInBox = MaxBox - grid.cells[x][y].coalAmount;
                    uint256 coalTransferred = 0;

                    // Переносим уголь в бокс, но не больше доступного места
                    if (coalToMove > availableSpaceInBox) {
                        coalTransferred = availableSpaceInBox;
                        grid.cells[x][y].coalAmount = MaxBox; // Заполняем бокс до 400
                    } else {
                        coalTransferred = coalToMove;
                        grid.cells[x][y].coalAmount += coalToMove;
                    }

                    grid.cells[x + 1][y].coalAmount -= coalTransferred;

                    // Если в буре осталось угля, обновляем его
                    if (grid.cells[x + 1][y].coalAmount > MaxDrill) {
                        grid.cells[x + 1][y].coalAmount = MaxDrill;
                    }

                    emit CoalUpdated(msg.sender, x, y, grid.cells[x][y].coalAmount);
                    emit CoalUpdated(msg.sender, x + 1, y, grid.cells[x + 1][y].coalAmount);
                }

				// Повторяем для других соседей (справа, сверху, снизу)...
                if (y < gridSize - 1 && grid.cells[x][y + 1].drill) {  // Сосед 
                    uint256 coalToMove = grid.cells[x][y + 1].coalAmount;
                    uint256 availableSpaceInBox = MaxBox - grid.cells[x][y].coalAmount;
                    uint256 coalTransferred = 0;

                    // Переносим уголь в бокс, но не больше доступного места
                    if (coalToMove > availableSpaceInBox) {
                        coalTransferred = availableSpaceInBox;
                        grid.cells[x][y].coalAmount = MaxBox; // Заполняем бокс до 400
                    } else {
                        coalTransferred = coalToMove;
                        grid.cells[x][y].coalAmount += coalToMove;
                    }

                    grid.cells[x][y + 1].coalAmount -= coalTransferred;

                    // Если в буре осталось угля, обновляем его
                    if (grid.cells[x][y + 1].coalAmount > MaxDrill) {
                        grid.cells[x][y + 1].coalAmount = MaxDrill;
                    }

                    emit CoalUpdated(msg.sender, x, y, grid.cells[x][y].coalAmount);
                    emit CoalUpdated(msg.sender, x + 1, y, grid.cells[x][y + 1].coalAmount);
                }

                if (y > 0 && grid.cells[x][y - 1].drill) {  // Сосед 
                    uint256 coalToMove = grid.cells[x][y - 1].coalAmount;
                    uint256 availableSpaceInBox = MaxBox - grid.cells[x][y].coalAmount;
                    uint256 coalTransferred = 0;

                    // Переносим уголь в бокс, но не больше доступного места
                    if (coalToMove > availableSpaceInBox) {
                        coalTransferred = availableSpaceInBox;
                        grid.cells[x][y].coalAmount = MaxBox; // Заполняем бокс до 400
                    } else {
                        coalTransferred = coalToMove;
                        grid.cells[x][y].coalAmount += coalToMove;
                    }

                    grid.cells[x][y - 1].coalAmount -= coalTransferred;

                    // Если в буре осталось угля, обновляем его
                    if (grid.cells[x][y - 1].coalAmount > MaxDrill) {
                        grid.cells[x][y - 1].coalAmount = MaxDrill;
                    }

                    emit CoalUpdated(msg.sender, x, y, grid.cells[x][y].coalAmount);
                    emit CoalUpdated(msg.sender, x + 1, y, grid.cells[x][y - 1].coalAmount);
                }
				
				
			}
        }
    }
	}
}

*/
}