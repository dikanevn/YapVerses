// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GridGame {
    uint8 public constant gridSize = 10;  // Размер сетки 10x10

    // Сектор для каждого пользователя
    mapping(address => string[gridSize][gridSize]) public sectors;  // Сектор с рудой и буром

    // События для добавления и удаления руды, бура и ящиков
    event OrePlaced(address user, uint8 x, uint8 y);
    event OreRemoved(address user, uint8 x, uint8 y);
    event DrillPlaced(address user, uint8 x, uint8 y);
    event DrillRemoved(address user, uint8 x, uint8 y);

    // Функция для получения сектора пользователя
    function getSector(address user) public view returns (string[gridSize][gridSize] memory) {
        return sectors[user];
    }

    // Функция для добавления руды в сектор пользователя
    function placeOre(uint8 x, uint8 y) public {
        require(x < gridSize && y < gridSize, "Invalid cell coordinates");
        require(keccak256(abi.encodePacked(sectors[msg.sender][x][y])) == keccak256(abi.encodePacked("Empty")), "Cell is not empty");

        sectors[msg.sender][x][y] = "Ore";  // Размещаем руду в ячейке
        emit OrePlaced(msg.sender, x, y);
    }

    // Функция для удаления руды из сектора пользователя
    function removeOre(uint8 x, uint8 y) public {
        require(x < gridSize && y < gridSize, "Invalid cell coordinates");
        require(keccak256(abi.encodePacked(sectors[msg.sender][x][y])) == keccak256(abi.encodePacked("Ore")), "No ore to remove");

        sectors[msg.sender][x][y] = "Empty";  // Убираем руду из ячейки
        emit OreRemoved(msg.sender, x, y);
    }

    // Функция для размещения бура в секторе пользователя
    function placeDrill(uint8 x, uint8 y) public {
        require(x < gridSize && y < gridSize, "Invalid cell coordinates");
        require(keccak256(abi.encodePacked(sectors[msg.sender][x][y])) == keccak256(abi.encodePacked("Ore")), "No ore to drill");

        sectors[msg.sender][x][y] = "Drill";  // Размещаем бур на ячейке
        emit DrillPlaced(msg.sender, x, y);
    }

    // Функция для удаления бура из сектора пользователя
    function removeDrill(uint8 x, uint8 y) public {
        require(x < gridSize && y < gridSize, "Invalid cell coordinates");
        require(keccak256(abi.encodePacked(sectors[msg.sender][x][y])) == keccak256(abi.encodePacked("Drill")), "No drill to remove");

        sectors[msg.sender][x][y] = "Empty";  // Убираем бур с ячейки
        emit DrillRemoved(msg.sender, x, y);
    }
}
