"use strict";

// Добавляем переменную для процента продаж (например, 5% продажи = 0.05)
const sellPercent = 0.05; // измените значение по необходимости

// Функция-симулятор стратегии
function simulateStrategy(tradesPerDay, days) {
    // Если продаж не делаем, просто считаем итоговую стоимость по конечной цене
    if (tradesPerDay === 0) {
        let finalPrice = Math.pow(2, days); // цена в конце 10-го дня
        return {
            tradesPerDay: 0,
            cash: 0,
            tokens: 1,
            finalTokenValue: 1 * finalPrice,
            total: 1 * finalPrice
        };
    }
  
    let tokens = 1; // начальное количество токенов
    let cash = 0;  // выручка в долларах
  
    // Проходим по каждому дню
    for (let d = 1; d <= days; d++) {
        // Цена в начале дня = 2^(d-1)
        let dayStartPrice = Math.pow(2, d - 1);
        // Для заданного числа сделок в день
        const trades = tradesPerDay;
        // Используем переменную sellPercent для расчёта доли, продаваемой за одну сделку:
        let sellFraction = sellPercent / trades;
    
        for (let i = 1; i <= trades; i++) {
            // Определяем момент сделки: доля дня t = i / trades
            let t = i / trades;
            // Цена в момент сделки: она растёт экспоненциально в течение дня (от dayStartPrice до dayStartPrice*2)
            let price = dayStartPrice * Math.pow(2, t);
            // Вычисляем, сколько токенов продаётся в данной сделке
            let tokensToSell = tokens * sellFraction;
            // Увеличиваем кэш на выручку от продажи
            cash += tokensToSell * price;
            // Уменьшаем количество оставшихся токенов
            tokens -= tokensToSell;
        }
        // После заключения всех сделок в дне оставшиеся токены будут оцениваться по цене в конце дня.
        // (Цена в конце дня = dayStartPrice*2, но мы сохраняем только количество токенов,
        //  поскольку цена вычисляется отдельно для итоговой оценки.)
    }
  
    // По окончании всех дней итоговая цена оставшихся токенов – цена последнего дня: 2^(days)
    let finalPrice = Math.pow(2, days);
    let finalTokenValue = tokens * finalPrice;
    let total = cash + finalTokenValue;
  
    return { tradesPerDay, cash, tokens, finalTokenValue, total };
}

// Задаём количество дней и варианты частоты продаж
let days = 10;
let frequencies = [0, 1, 2, 10, 1000];

frequencies.forEach(trades => {
    let result = simulateStrategy(trades, days);
    if(trades === 0) {
        console.log(`Без продаж: Итоговая стоимость портфеля: $${result.total.toFixed(2)}`);
    } else {
        console.log(`Продажи ${trades} раз/день: Итоговая стоимость портфеля: $${result.total.toFixed(2)} (Кэш: $${result.cash.toFixed(2)}, Осталось токенов: ${result.tokens.toFixed(6)}, Стоимость оставшихся токенов: $${result.finalTokenValue.toFixed(2)})`);
    }
});