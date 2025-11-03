/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 * @param {*} n
   @returns {boolean}
 */
function isInteger(n) {
  // Проверяем, что тип — число и побитовое сравнение не изменяет значение
  return typeof n === 'number' && (n | 0) === n;
}

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
/**
 * Возвращает массив четных чисел от 2 до 20 включительно
 * @returns {number[]}
 */
function even() {
  const result = [];
  for (let i = 2; i <= 20; i += 2) {
    result.push(i);
  }
  return result;
}

/**
 * Считает сумму чисел от 1 до n включительно, используя цикл
 * @param {number} n
 * @returns {number}
 */
function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Считает сумму чисел от 1 до n включительно, используя рекурсию
 * @param {number} n
 * @returns {number}
 */
function recSumTo(n) {
  if (n <= 1) return n; // базовый случай
  return n + recSumTo(n - 1); // рекурсивный вызов
}

/**
 * Напишите функцию, считающую факториал заданного числа
/**
 * Считает факториал заданного числа n (n!)
 * @param {number} n
 * @returns {number} n! или NaN для некорректного ввода
 */
function factorial(n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) return NaN;
  if (n === 0 || n === 1) return 1;

  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Определяет, является ли число степенью двойки
 * @param {number} n
 * @returns {boolean}
 */
function isBinary(n) {
  // Проверяем, что n — положительное целое и содержит только один установленный бит
  return typeof n === 'number' && n > 0 && (n & (n - 1)) === 0;
}


/**
 * Находит N-е число Фибоначчи
 * @param {number} n
 * @returns {number}
 */
function fibonacci(n) {
  if (typeof n !== 'number' || n < 1 || !Number.isInteger(n)) return NaN;
  if (n === 1 || n === 2) return 1;

  let a = 1, b = 1;
  for (let i = 3; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}


/**
 * Создаёт функцию, выполняющую заданную операцию с накопленным значением
 * @param {*} initialValue — начальное значение
 * @param {function} [operatorFn] — функция операции (storedValue, newValue) => result
 * @returns {function} — функция, принимающая новое значение и возвращающая результат
 */
function getOperationFn(initialValue, operatorFn) {
  // если оператор не передан — возвращаем замыкание, которое всегда выдаёт initialValue
  if (typeof operatorFn !== 'function') {
    return function() {
      return initialValue;
    };
  }

  let storedValue = initialValue;

  return function(newValue) {
    storedValue = operatorFn(storedValue, newValue);
    return storedValue;
  };
}

/**
 * Создаёт генератор арифметической последовательности
 * @param {number} [start=0] - начальное значение
 * @param {number} [step=1] - шаг последовательности
 * @returns {function} generator — функция, возвращающая следующее число при каждом вызове
 */
function sequence(start = 0, step = 1) {
  let current = start;

  return function() {
    const value = current;
    current += step;
    return value;
  };
}

/**
 * Глубокое сравнение двух значений/объектов
 * - Поддерживает массивы
 * - Срабатывает на NaN (Object.is)
 * - Защита от циклических ссылок
 * Специальные типы (Date, RegExp, Map, Set, Function) умышленно не поддерживаются.
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  // Быстрый путь: строгое равенство с учётом NaN и -0 (Object.is)
  if (Object.is(a, b)) return true;

  // Если типы разные или одно из значений не объект — уже не равны
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  // Внутренний рекурсивный сравниватель с защитой от циклов
  const seen = new WeakMap();
  function eq(x, y) {
    if (Object.is(x, y)) return true;
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
      return false;
    }

    // Циклические ссылки: если уже сравнивали эту пару — считаем равными
    let inner = seen.get(x);
    if (inner && inner.has(y)) return true;
    if (!inner) {
      inner = new WeakSet();
      seen.set(x, inner);
    }
    inner.add(y);

    // Массивы/не массивы должны совпадать
    const xIsArr = Array.isArray(x);
    const yIsArr = Array.isArray(y);
    if (xIsArr !== yIsArr) return false;

    const keysX = Object.keys(x);
    const keysY = Object.keys(y);
    if (keysX.length !== keysY.length) return false;

    // Проверяем наличие одинаковых ключей
    for (const k of keysX) {
      if (!keysY.includes(k)) return false;
    }

    // Рекурсивно сравниваем значения по ключам
    for (const k of keysX) {
      if (!eq(x[k], y[k])) return false;
    }
    return true;
  }

  return eq(a, b);
}

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
