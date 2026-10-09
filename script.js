const display = document.getElementById('display');

let currentInput = '0';
let previousInput = '';
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = '0';
  previousInput = '';
  currentOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function appendNumber(value) {
  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    if (shouldResetDisplay) {
      currentInput = value;
      shouldResetDisplay = false;
    } else {
      currentInput += value;
    }
  }

  updateDisplay();
}

function chooseOperator(operator) {
  const inputValue = Number(currentInput);

  if (currentOperator && previousInput !== '' && !shouldResetDisplay) {
    calculate();
  }

  previousInput = String(inputValue);
  currentOperator = operator;
  shouldResetDisplay = true;
}

function calculate() {
  if (!currentOperator || previousInput === '') return;

  const firstValue = Number(previousInput);
  const secondValue = Number(currentInput);
  let result = 0;

  switch (currentOperator) {
    case '+':
      result = firstValue + secondValue;
      break;
    case '-':
      result = firstValue - secondValue;
      break;
    case '*':
      result = firstValue * secondValue;
      break;
    case '/':
      result = secondValue === 0 ? 'Error' : firstValue / secondValue;
      break;
    default:
      return;
  }

  if (result === 'Error') {
    currentInput = 'Error';
    previousInput = '';
    currentOperator = null;
    shouldResetDisplay = true;
    updateDisplay();
    return;
  }

  currentInput = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
  previousInput = '';
  currentOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      clearCalculator();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'equals':
      calculate();
      break;
    default:
      break;
  }
}

document.querySelectorAll('.number').forEach((button) => {
  button.addEventListener('click', () => {
    appendNumber(button.dataset.value);
  });
});

document.querySelectorAll('.operator').forEach((button) => {
  button.addEventListener('click', () => {
    chooseOperator(button.dataset.value);
  });
});

document.querySelectorAll('.control, .equal').forEach((button) => {
  button.addEventListener('click', () => {
    handleAction(button.dataset.action);
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (key === '.') {
    appendNumber('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    chooseOperator(key);
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();

