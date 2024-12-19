// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8 .0;
contract SimpleGrid {
	// Define the grid size
	uint256 public constant gridSize = 10;
	uint256 public constant oreProbability = 20;

	uint256 public constant MaxBox = 400000;
	//uint256 mtime = 4;
	struct Cell {
		string content; // "Coal", "contentEmpty", "Iron", "Space", "Ruins";
		string tool; // "Drill", "Box", "Man", "Furnace", "Factory", "toolEmpty";
		uint256 coalAmount;
		uint256 lastTimeChecked;
		string man; // "LR" или "RL" или "UD" или "DU" или "manEmpty";
		uint256 ironAmount;
		uint256 ironplateAmount;
		uint256 componentsAmount;
		string factorySettings; // "drillsF", "boxesF", "mansF", "furnaceF", "factoryF", "bulldozerF", "componentsF", "factorySettingsEmptyF", "",
		string previouscontent; // "Coal", "contentEmpty", "Iron", "Space", "Ruins";
	}
	struct Grid {
		Cell[gridSize][gridSize] cells;
	}
	struct Depot {
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
	}
	mapping(address => Grid) private grids;
	mapping(address => Depot) private depots;


	function initializeGrid() external {
		Grid storage grid = grids[msg.sender];
		for (uint256 x = 0; x < gridSize; x++) {
			for (uint256 y = 0; y < gridSize; y++) {
				uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100;
				if (random < (oreProbability * 2)) { // nu a cho
					if (random < oreProbability) {
						grid.cells[x][y] = Cell("Iron", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
					}
					else {
						grid.cells[x][y] = Cell("Coal", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
					}
				}
				else {
					grid.cells[x][y] = Cell("contentEmpty", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
				}
			}
		}

		depots[msg.sender] = Depot(50, 50, 50, 50, 50, block.timestamp, block.timestamp, block.timestamp, 50, 0, 4, 120);

	}


	function getCell(uint256 x, uint256 y) external view returns(Cell memory) {
		require(x < gridSize && y < gridSize, "Invalid coordinates");
		return grids[msg.sender].cells[x][y];
	}

	function getDepot() external view returns(Depot memory) {
		return depots[msg.sender];
	}



	function mmmtimeUpdate(uint256 decrementValue) external {
		Depot storage depot = depots[msg.sender];
		depot.mmmtime = decrementValue;
	}

	function mmmdrillSpeedUpdate(uint256 decrementValue) external {
		Depot storage depot = depots[msg.sender];
		depot.mmmdrillSpeed = decrementValue;
	}




	function starttimeeUpdate(uint256 decrementValue) external {
		Grid storage grid = grids[msg.sender];

		Depot storage depot = depots[msg.sender];
		require(decrementValue < depot.lastmeteoritTimeChecked, "Decrement value exceeds starttimee");
		require(decrementValue < 1733874056, "max 100000");
		depot.lastmeteoritTimeChecked -= decrementValue;
		depot.blocktimestamp = block.timestamp;
		depot.early = block.timestamp - depot.lastmeteoritTimeChecked;
		for (uint256 x = 0; x < gridSize; x++) {
			for (uint256 y = 0; y < gridSize; y++) {
				grid.cells[x][y].lastTimeChecked -= decrementValue;
			}
		}




	}
	
	
	function placeBox(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.boxesAmount > 0, "No boxes available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");

		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		grid.cells[x][y].tool = "Box";
		depot.boxesAmount--;
	}
	
	
	

	function factorySettingsUpdate(uint256 x, uint256 y, string memory factorySettingsType) external {
		Grid storage grid = grids[msg.sender];
		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("drillsF"))) {
			grid.cells[x][y].factorySettings = "drillsF";
		}
		else

		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("boxesF"))) {
			grid.cells[x][y].factorySettings = "boxesF";
		}
		else

		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("mansF"))) {
			grid.cells[x][y].factorySettings = "mansF";
		}
		else

		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("furnaceF"))) {
			grid.cells[x][y].factorySettings = "furnaceF";
		}
		else


		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("factoryF"))) {
			grid.cells[x][y].factorySettings = "factoryF";
		}
		else


		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("bulldozerF"))) {
			grid.cells[x][y].factorySettings = "bulldozerF";
		}
		else


		if (keccak256(abi.encodePacked(factorySettingsType)) == keccak256(abi.encodePacked("componentsF"))) {
			grid.cells[x][y].factorySettings = "componentsF";
		}

	}



	function placeDrill(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.drillsAmount > 0, "No drills available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("contentEmpty")), "No ore to drill");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");

		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		grid.cells[x][y].tool = "Drill";
		grid.cells[x][y].lastTimeChecked = block.timestamp;
		depot.drillsAmount--;
	}



	function placeManLR(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.mansAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Man";
		grid.cells[x][y].man = "LR";
		depot.mansAmount--;
	}

	function placeManRL(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.mansAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Man";
		grid.cells[x][y].man = "RL";
		depot.mansAmount--;
	}

	function placeManDU(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.mansAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Man";
		grid.cells[x][y].man = "DU";
		depot.mansAmount--;
	}

	function placeManUD(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.mansAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Man";
		grid.cells[x][y].man = "UD";
		depot.mansAmount--;
	}

	function placeFurnace(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.furnaceAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Furnace";
		depot.furnaceAmount--;
	}



	function placeFactory(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.factoryAmount > 0, "No mansAmount available");
		require(keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty")), "Tool already placed");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")), "Space");
		require(keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins")), "Ruins");
		grid.cells[x][y].tool = "Factory";
		depot.factoryAmount--;
	}

	function removeTool(uint256 x, uint256 y) public {
		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		Depot storage depot = depots[msg.sender];
		string memory toolType = grid.cells[x][y].tool;
		if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Drill"))) {
			depot.drillsAmount += 1;
		}
		else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Box"))) {
			depot.boxesAmount += 1;
		}
		else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Man"))) {
			depot.mansAmount += 1;
		}
		else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Furnace"))) {
			depot.furnaceAmount += 1;
		}
		else if (keccak256(abi.encodePacked(toolType)) == keccak256(abi.encodePacked("Factory"))) {
			depot.factoryAmount += 1;
		}
		grid.cells[x][y].man = "manEmpty";
		grid.cells[x][y].tool = "toolEmpty";
		grid.cells[x][y].coalAmount = 0;
		grid.cells[x][y].ironAmount = 0;
		grid.cells[x][y].ironplateAmount = 0;
		grid.cells[x][y].factorySettings = "factorySettingsEmptyF";
	}

	function placeBulldozer(uint256 x, uint256 y) external {
		Depot storage depot = depots[msg.sender];

		require(x < gridSize && y < gridSize, "Invalid coordinates");
		Grid storage grid = grids[msg.sender];
		require(depot.bulldozerAmount > 0, "No bulldozerAmount available");
		require(
			keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Space")) ||
			keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Ruins")),
			"Not Space or Ruins"
		);



		depot.bulldozerAmount--;



		uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, x, y, msg.sender))) % 100;
		if (random < (oreProbability * 2)) { // nu a cho
			if (random < oreProbability) {
				grid.cells[x][y] = Cell("Iron", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
			}
			else {
				grid.cells[x][y] = Cell("Coal", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
			}
		}
		else {
			grid.cells[x][y] = Cell("contentEmpty", "toolEmpty", 0, block.timestamp, "manEmpty", 0, 0, 0, "factorySettingsEmptyF", "contentEmpty");
		}

	}






	function meteoritfunction() public {
		Depot storage depot = depots[msg.sender];

		if ((block.timestamp - depot.lastmeteoritTimeChecked) > depot.mmmtime) {
			bool didmeteorit = false;
			Grid storage grid = grids[msg.sender];
			depot.early = block.timestamp - depot.lastmeteoritTimeChecked;
			uint256 iterationLimit = 100; // 1733874811
			uint256 iterationCount = 0;
			while (block.timestamp - depot.lastmeteoritTimeChecked > depot.mmmtime && iterationCount < iterationLimit) {
				uint256 k = 0;

k++;
				if (k == gridSize * gridSize) {

					depot.lastmeteoritTimeChecked = block.timestamp - 1 - depot.mmmtime;

				}
				

				
uint256 x;
uint256 y; 



for (uint256 layer = 0; layer <= gridSize / 2; layer++) {
    bool found = false;

    for (uint256 i = layer; i < gridSize - layer; i++) {


        x = layer;
        y = i;
        if (
		
		
		
							(
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space"))
							) && (
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins"))
							)
		
		
		
		) {
            found = true;
            break;
        }

        x = gridSize - 1 - layer;
        y = i;
        if (							
		(
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space"))
							) && (
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins"))
							)
							) {
            found = true;
            break;
        }
    }
    if (found) break;

    for (uint256 i = layer + 1; i < gridSize - 1 - layer; i++) {
        x = i;
        y = layer;
        if (							(
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space"))
							) && (
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins"))
							)) {
            found = true;
            break;
        }

        x = i;
        y = gridSize - 1 - layer;
        if (							(
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space"))
							) && (
								keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins"))
							)) {
            found = true;
            break;
        }
    }
    if (found) break;
}

	
	
	

				depot.lastmeteoritTimeChecked += depot.mmmtime;

				if (
					keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Space")) &&
					keccak256(abi.encodePacked(grid.cells[x][y].content)) != keccak256(abi.encodePacked("Ruins"))
				) {


					didmeteorit = true;
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
					grid.cells[x][y].man = "manEmpty";
					grid.cells[x][y].coalAmount = 0;
					grid.cells[x][y].ironAmount = 0;
					grid.cells[x][y].ironplateAmount = 0;
					grid.cells[x][y].componentsAmount = 0;


					if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("toolEmpty"))) {


						grid.cells[x][y].content = "Space";
					}
					else {

						grid.cells[x][y].content = "Ruins";
					}



					grid.cells[x][y].tool = "toolEmpty";




					grid.cells[x][y].factorySettings = "factorySettingsEmptyF";
				}
				iterationCount++;
			}

			depot.blocktimestamp = block.timestamp;
			depot.early = block.timestamp - depot.lastmeteoritTimeChecked;
		}
	}







	function transferResourses(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		if (fromX >= 0 && fromX < gridSize && fromY >= 0 && fromY < gridSize && toX >= 0 && toX < gridSize && toY >= 0 && toY < gridSize) {

			transferCoal(fromX, fromY, toX, toY);
			transferIron(fromX, fromY, toX, toY);
			transferIronPlate(fromX, fromY, toX, toY);
			transferComponents(fromX, fromY, toX, toY);



		}
	}






	function transferCoal(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		Grid storage grid = grids[msg.sender];
		Cell storage source = grid.cells[fromX][fromY];
		Cell storage destination = grid.cells[toX][toY];

		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")) ||
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Furnace"))
			) && (
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Drill")) ||
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Box"))
			)




		) {





			uint256 TempMaxBox = MaxBox;



			uint256 resourceToMove = source.coalAmount / 5;
			uint256 availableSpaceInBox = TempMaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred = 0;
			if (resourceToMove > availableSpaceInBox) {
				destination.coalAmount = availableSpaceInBox;
			}
			else {
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

		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box")) ||
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Furnace"))
			) && (
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Drill")) ||
				keccak256(abi.encodePacked(source.tool)) == keccak256(abi.encodePacked("Box"))
			)




		) {
			uint256 TempMaxBox = MaxBox;


			if ((keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("toolEmpty"))) && (keccak256(abi.encodePacked(destination.tool)) != keccak256(abi.encodePacked("Factory")))) {
				uint256 resourceToMove = source.ironAmount / 5;
				uint256 availableSpaceInBox = TempMaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
				uint256 resourceTransferred = 0;
				if (resourceToMove > availableSpaceInBox) {
					destination.ironAmount = availableSpaceInBox;
				}
				else {
					resourceTransferred = resourceToMove;
					destination.ironAmount += resourceToMove;
				}
				source.ironAmount -= resourceTransferred;
			}
		}
	}

	function transferIronPlate(uint256 fromX, uint256 fromY, uint256 toX, uint256 toY) public {
		Grid storage grid = grids[msg.sender];
		Cell storage source = grid.cells[fromX][fromY];
		Cell storage destination = grid.cells[toX][toY];

		if ((keccak256(abi.encodePacked(destination.factorySettings)) == keccak256(abi.encodePacked("componentsF")) || (keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box"))))) {

			uint256 TempMaxBox = MaxBox;


			uint256 resourceToMove = source.ironplateAmount / 5;
			uint256 availableSpaceInBox = TempMaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred = 0;
			if (resourceToMove > availableSpaceInBox) {
				destination.ironplateAmount = availableSpaceInBox;
			}
			else {
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

		if (
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Factory")) &&
				keccak256(abi.encodePacked(destination.factorySettings)) != keccak256(abi.encodePacked("componentsF"))
			) ||
			(
				keccak256(abi.encodePacked(destination.tool)) == keccak256(abi.encodePacked("Box"))
			)
		) {
			uint256 TempMaxBox = MaxBox;


			uint256 resourceToMove = source.componentsAmount / 5;
			uint256 availableSpaceInBox = TempMaxBox - (destination.coalAmount + destination.ironAmount + destination.ironplateAmount + destination.componentsAmount);
			uint256 resourceTransferred = 0;
			if (resourceToMove > availableSpaceInBox) {
				destination.componentsAmount = availableSpaceInBox;
			}
			else {
				resourceTransferred = resourceToMove;
				destination.componentsAmount += resourceToMove;
			}
			source.componentsAmount -= resourceTransferred;

		}
	}





	function updateCoal() public {
		Grid storage grid = grids[msg.sender];
		Depot storage depot = depots[msg.sender];
		depot.blocktimestamp = block.timestamp;
		if (block.timestamp - depot.lastmeteoritTimeChecked > depot.mmmtime) {


			meteoritfunction();

		}


		uint256 totalCells = gridSize * gridSize;
		uint256[] memory indices = new uint256[](totalCells);


		for (uint256 i = 0; i < totalCells; i++) {
			indices[i] = i;
		}


		for (uint256 i = totalCells - 1; i > 0; i--) {
			uint256 j = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (i + 1);
			(indices[i], indices[j]) = (indices[j], indices[i]);
		}




		for (uint256 iter = 0; iter < totalCells; iter++) {
			uint256 index = indices[iter];
			uint256 x = index % gridSize;
			uint256 y = index / gridSize;

			Cell storage cell = grid.cells[x][y];

			bytes32 manType = keccak256(abi.encodePacked(cell.man));

			if (manType != keccak256(abi.encodePacked("manEmpty"))) {




				if (manType == keccak256(abi.encodePacked("LR"))) {
					transferResourses(x - 1, y, x + 1, y);
					//try this.transferResourses(x - 1, y, x + 1, y) {} catch {}
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







			if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Drill")) && keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Coal"))) {

				grid.cells[x][y].coalAmount += (block.timestamp - cell.lastTimeChecked) * depot.mmmdrillSpeed;
				if (grid.cells[x][y].coalAmount > MaxBox) {
					grid.cells[x][y].coalAmount = MaxBox;
				}
				grid.cells[x][y].lastTimeChecked = block.timestamp;

			}




			if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Drill")) && keccak256(abi.encodePacked(grid.cells[x][y].content)) == keccak256(abi.encodePacked("Iron"))) {

				grid.cells[x][y].ironAmount += (block.timestamp - cell.lastTimeChecked) * depot.mmmdrillSpeed;
				if (grid.cells[x][y].ironAmount > MaxBox) {
					grid.cells[x][y].ironAmount = MaxBox;
				}
				grid.cells[x][y].lastTimeChecked = block.timestamp;

			}




			if (keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Furnace")) && grid.cells[x][y].coalAmount >= 10 && grid.cells[x][y].ironAmount >= 10) {

				while (grid.cells[x][y].coalAmount >= 10 && grid.cells[x][y].ironAmount >= 10) {
					grid.cells[x][y].coalAmount -= 10;
					grid.cells[x][y].ironAmount -= 10;
					grid.cells[x][y].ironplateAmount += 1;
				}
			}


			if (keccak256(abi.encodePacked(grid.cells[x][y].factorySettings)) == keccak256(abi.encodePacked("componentsF")) && keccak256(abi.encodePacked(grid.cells[x][y].tool)) == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].ironplateAmount >= 10) {
				while (grid.cells[x][y].ironplateAmount >= 10) {
					grid.cells[x][y].ironplateAmount -= 10;
					grid.cells[x][y].componentsAmount += 1;
				}
			}


			// Предварительно вычисляем хэши для текущей ячейки
			bytes32 factorySettingsHash = keccak256(abi.encodePacked(grid.cells[x][y].factorySettings));
			bytes32 toolHash = keccak256(abi.encodePacked(grid.cells[x][y].tool));

			// Проверяем, что инструмент — "Factory" и есть достаточно компонентов
			if (toolHash == keccak256(abi.encodePacked("Factory")) && grid.cells[x][y].componentsAmount >= 10) {
				while (grid.cells[x][y].componentsAmount >= 10) {
					grid.cells[x][y].componentsAmount -= 10;

					// Обновляем значение в зависимости от factorySettings
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
						// Неизвестный тип, пропускаем
						grid.cells[x][y].componentsAmount += 10; // Возвращаем компоненты
						break;
					}
				}
			}

		}





	}

}