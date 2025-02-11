module.exports = {
  // ... другие настройки webpack ...
  ignoreWarnings: [
    {
      // Игнорировать предупреждения, связанные с пакетами @metaplex-foundation/beet-solana
      module: /@metaplex-foundation\/beet-solana/,
    },
    {
      // Игнорировать предупреждения, связанные с пакетом superstruct
      module: /superstruct/,
    },
  ],
  // ... остальные настройки ...
}; 