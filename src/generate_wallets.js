const { Wallet } = require('ethers');

function generateAddresses(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const wallet = Wallet.createRandom(); // Создаём случайный кошелёк
        results.push({
            address: wallet.address, // Ethereum-адрес
            privateKey: wallet.privateKey // Приватный ключ
        });
    }
    return results;
}

// Укажите количество адресов для генерации
const count = 10;
const generatedAddresses = generateAddresses(count);

// Выводим результаты
console.log("Generated Ethereum Wallets:");
console.log(generatedAddresses);

// Сохраняем результаты в JSON-файл
const fs = require('fs');
fs.writeFileSync('generated_wallets.json', JSON.stringify(generatedAddresses, null, 2), 'utf-8');
console.log("Addresses and private keys saved to 'generated_wallets.json'");
