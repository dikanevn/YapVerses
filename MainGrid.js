// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MainGrid {
	
uint256 public constant MaxBox = 400000;
	
	
	
    struct Cell {
        string content;// "Coal", "contentEmpty", "Iron", "Update";
        string tool;// "Drill", "Box", "Man", "Furnace", "Factory", "toolEmpty", "Space", "Ruins", "Wall";
        uint256 coalAmount;
        uint256 lastTimeChecked;
        string man;// "LR" или "RL" или "UD" или "DU" или "manEmpty";
        uint256 ironAmount;
        uint256 ironplateAmount;
        uint256 componentsAmount;
        string factorySettings;// "drillsF", "boxesF", "mansF", "furnaceF", "factoryF", "bulldozerF", "componentsF", "factorySettingsEmptyF", "wallF", "",
        string previouscontent;// "Coal", "contentEmpty", "Iron";
		uint256 wallPowerAmount; // Крепкость стены 

    }

struct Depot { 
    uint256 gridSize; // Размер сетки для пользователя
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


    struct Grid {
        mapping(uint256 => mapping(uint256 => Cell)) cells; // Динамический размер
    }

    mapping(address => Depot) private depots;
    mapping(address => Grid) private grids;

    mapping(address => bool) private allowedContracts;
    address[] private allowedContractsList;

    address public admin;

    event ContractAllowed(address indexed contractAddress);
    event ContractDisallowed(address indexed contractAddress);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    modifier onlyAllowedContracts() {
        //require(allowedContracts[msg.sender], "Not an allowed contract");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function allowContract(address contractAddress) external onlyAdmin {
        require(!allowedContracts[contractAddress], "Already allowed");
        allowedContracts[contractAddress] = true;
        allowedContractsList.push(contractAddress);
        emit ContractAllowed(contractAddress);
    }

    function disallowContract(address contractAddress) external onlyAdmin {
        require(allowedContracts[contractAddress], "Not allowed");
        allowedContracts[contractAddress] = false;
        emit ContractDisallowed(contractAddress);
    }

    function getAllowedContracts() external view returns (address[] memory) {
        return allowedContractsList;
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != admin, "Already the current admin");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }




function getMaxBox() external pure returns (uint256) {
    return MaxBox;
}



function updateContent(
    address user,
    uint256 x,
    uint256 y,
    string memory content
) external onlyAllowedContracts {
    grids[user].cells[x][y].content = content;
}

function updateTool(
    address user,
    uint256 x,
    uint256 y,
    string memory tool
) external onlyAllowedContracts {
    grids[user].cells[x][y].tool = tool;
}



function updateWallPowerAmount(
    address user,
    uint256 x,
    uint256 y,
    uint256 wallPowerAmount
) external onlyAllowedContracts {
    grids[user].cells[x][y].wallPowerAmount = wallPowerAmount;
}



function updateCoalAmount(
    address user,
    uint256 x,
    uint256 y,
    uint256 coalAmount
) external onlyAllowedContracts {
    grids[user].cells[x][y].coalAmount = coalAmount;
}

function updateLastTimeChecked(
    address user,
    uint256 x,
    uint256 y,
    uint256 lastTimeChecked
) external onlyAllowedContracts {
    grids[user].cells[x][y].lastTimeChecked = lastTimeChecked;
}

function updateMan(
    address user,
    uint256 x,
    uint256 y,
    string memory man
) external onlyAllowedContracts {
    grids[user].cells[x][y].man = man;
}

function updateIronAmount(
    address user,
    uint256 x,
    uint256 y,
    uint256 ironAmount
) external onlyAllowedContracts {
    grids[user].cells[x][y].ironAmount = ironAmount;
}

function updateIronplateAmount(
    address user,
    uint256 x,
    uint256 y,
    uint256 ironplateAmount
) external onlyAllowedContracts {
    grids[user].cells[x][y].ironplateAmount = ironplateAmount;
}

function updateComponentsAmount(
    address user,
    uint256 x,
    uint256 y,
    uint256 componentsAmount
) external onlyAllowedContracts {
    grids[user].cells[x][y].componentsAmount = componentsAmount;
}

function updateFactorySettings(
    address user,
    uint256 x,
    uint256 y,
    string memory factorySettings
) external onlyAllowedContracts {
    grids[user].cells[x][y].factorySettings = factorySettings;
}

function updatePreviousContent(
    address user,
    uint256 x,
    uint256 y,
    string memory previouscontent
) external onlyAllowedContracts {
    grids[user].cells[x][y].previouscontent = previouscontent;
}





function getDepot(address user) external view returns (Depot memory) {
    return depots[user];
}



function getCell(address user, uint256 x, uint256 y) external view returns (Cell memory) {
    return grids[user].cells[x][y];
}

function getCellsBatch(address user, uint256[] calldata indices, uint256 gridSize) 
    external 
    view 
    returns (Cell[] memory) 
{
    uint256 length = indices.length;
    Cell[] memory cells = new Cell[](length);

    for (uint256 i = 0; i < length; i++) {
        uint256 x = indices[i] % gridSize;
        uint256 y = indices[i] / gridSize;

        cells[i] = grids[user].cells[x][y];
    }

    return cells;
}


function updateDepotPart1(
    address user,
    uint256 gridSize, // Добавить gridSize как входной параметр
    uint256 drillsAmount,
    uint256 boxesAmount,
    uint256 mansAmount,
    uint256 furnaceAmount,
    uint256 factoryAmount,
	uint256 wallAmount
) external onlyAllowedContracts {
    Depot storage depot = depots[user];
    depot.gridSize = gridSize; // Устанавливаем размер сетки
    depot.drillsAmount = drillsAmount;
    depot.boxesAmount = boxesAmount;
    depot.mansAmount = mansAmount;
    depot.furnaceAmount = furnaceAmount;
    depot.factoryAmount = factoryAmount;
	depot.wallAmount = wallAmount;
}


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
) external onlyAllowedContracts {
    Depot storage depot = depots[user];
    depot.starttimee = starttimee;
    depot.lastmeteoritTimeChecked = lastmeteoritTimeChecked;
    depot.blocktimestamp = blocktimestamp;
    depot.bulldozerAmount = bulldozerAmount;
    depot.early = early;
    depot.mmmtime = mmmtime;
    depot.mmmdrillSpeed = mmmdrillSpeed;
    depot.iterationLimitDepot = iterationLimitDepot;

    // Добавлены три новых поля
    depot.isPaused = isPaused;
    depot.pausedDuration = pausedDuration;
    depot.pauseStartTime = pauseStartTime;
}



function updateMmmtime(address user, uint256 mmmtime) external onlyAllowedContracts {
    depots[user].mmmtime = mmmtime;
}






function updateDepotGridSize(address user, uint256 gridSize) external onlyAllowedContracts {
    Depot storage depot = depots[user];
    uint256 previousGridSize = depot.gridSize;
    uint256 previousTotalCells = previousGridSize * previousGridSize;
    uint256 newTotalCells = gridSize * gridSize;

    depot.gridSize = gridSize; // Устанавливаем новый размер сетки

    // Просто прибавляем разницу в количестве ячеек
    depot.theEndCount += (newTotalCells - previousTotalCells);
}

function updateDepotSpeedkoef(address user, uint256 speedkoef) external onlyAllowedContracts {
    depots[user].speedkoef = speedkoef;
}

function updateDepotWallAmount(address user, uint256 wallAmount) external onlyAllowedContracts {
    depots[user].wallAmount = wallAmount;
}

function updateDepotTheEndCount(address user, uint256 theEndCount) external onlyAllowedContracts {
    depots[user].theEndCount = theEndCount;
}





function updateDepotDrillsAmount(address user, uint256 drillsAmount) external onlyAllowedContracts {
    depots[user].drillsAmount = drillsAmount;
}

function updateDepotBoxesAmount(address user, uint256 boxesAmount) external onlyAllowedContracts {
    depots[user].boxesAmount = boxesAmount;
}

function updateDepotMansAmount(address user, uint256 mansAmount) external onlyAllowedContracts {
    depots[user].mansAmount = mansAmount;
}

function updateDepotFurnaceAmount(address user, uint256 furnaceAmount) external onlyAllowedContracts {
    depots[user].furnaceAmount = furnaceAmount;
}

function updateDepotFactoryAmount(address user, uint256 factoryAmount) external onlyAllowedContracts {
    depots[user].factoryAmount = factoryAmount;
}

function updateDepotStarttimee(address user, uint256 starttimee) external onlyAllowedContracts {
    depots[user].starttimee = starttimee;
}

function updateDepotLastMeteoritTimeChecked(address user, uint256 lastmeteoritTimeChecked) external onlyAllowedContracts {
    depots[user].lastmeteoritTimeChecked = lastmeteoritTimeChecked;
}

function updateDepotBlockTimestamp(address user, uint256 blocktimestamp) external onlyAllowedContracts {
    depots[user].blocktimestamp = blocktimestamp;
}

function updateDepotBulldozerAmount(address user, uint256 bulldozerAmount) external onlyAllowedContracts {
    depots[user].bulldozerAmount = bulldozerAmount;
}

function updateDepotEarly(address user, uint256 early) external onlyAllowedContracts {
    depots[user].early = early;
}

function updateDepotMmmtime(address user, uint256 mmmtime) external onlyAllowedContracts {
    depots[user].mmmtime = mmmtime;
}

function updateDepotMmmdrillSpeed(address user, uint256 mmmdrillSpeed) external onlyAllowedContracts {
    depots[user].mmmdrillSpeed = mmmdrillSpeed;
}

function updateDepotiterationLimitDepot(address user, uint256 iterationLimitDepot) external onlyAllowedContracts {
    depots[user].iterationLimitDepot = iterationLimitDepot;
}

function setDepotPause(address user, uint256 isPaused) external onlyAllowedContracts {
    depots[user].isPaused = isPaused; // Обновляем флаг паузы (0 - игра, 1 - пауза)
}

function updateDepotPausedDuration(address user, uint256 pausedDuration) external onlyAllowedContracts {
    depots[user].pausedDuration = pausedDuration; // Обновляем общее накопленное время паузы
}

function updateDepotPauseStartTime(address user, uint256 pauseStartTime) external onlyAllowedContracts {
    depots[user].pauseStartTime = pauseStartTime; // Обновляем время начала паузы
}










}
//main