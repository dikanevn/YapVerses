import React, { useState } from 'react';

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState(0);

  const handleSum = () => {
    setSum(num1 + num2);
  };

  return (
    <div>
      <h1>Сложение чисел</h1>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
          placeholder="Число 1"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
          placeholder="Число 2"
        />
        <button onClick={handleSum}>Посчитать</button>
      </div>
      <h2>Результат: {sum}</h2>
    </div>
  );
}

export default App;
