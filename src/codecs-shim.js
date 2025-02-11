// Этот shim возвращает объект с функциями encode/decode, использующими Buffer

"use strict";

function getBytesCodec() {
  return {
    encode: function (input) {
      // Преобразуем входное значение в Buffer
      return Buffer.from(input);
    },
    decode: function (buffer) {
      // Преобразуем Buffer в строку
      return buffer.toString();
    },
  };
}

// Экспортируем функцию через module.exports,
// чтобы при импорте через require({ getBytesCodec }) функция была доступна
module.exports = {
  getBytesCodec: getBytesCodec,
}; 