import React, { useState } from "react";
import Draggable from "react-draggable";

const Calculator = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [error, setError] = useState(false);
  // Add state for current expression display
  const [expressionDisplay, setExpressionDisplay] = useState("");

  const clearAll = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setError(false);
    setExpressionDisplay("");
  };

  const inputDigit = (digit) => {
    if (error) {
      setDisplay(String(digit));
      setError(false);
      setExpressionDisplay("");
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      // Prevent display from getting too long
      if (display.replace(/[.-]/g, "").length >= 12) return;
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (error) {
      setDisplay("0.");
      setError(false);
      setExpressionDisplay("");
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (nextOperator) => {
    if (error) {
      setError(false);
      setDisplay("0");
      setFirstOperand(null);
      setExpressionDisplay("");
      return;
    }

    const inputValue = parseFloat(display);
    const operatorSymbol = getOperatorSymbol(nextOperator);

    if (firstOperand === null) {
      // First time pressing an operator
      setFirstOperand(inputValue);
      setExpressionDisplay(`${formatResult(inputValue)} ${operatorSymbol}`);
    } else if (operator) {
      // Calculate result of previous operation
      const result = performCalculation();
      if (result === "Error") {
        setError(true);
        setDisplay("Error");
        setExpressionDisplay("");
        return;
      }
      setDisplay(formatResult(result));
      setFirstOperand(result);
      setExpressionDisplay(`${formatResult(result)} ${operatorSymbol}`);
    } else {
      // Update operator without calculation
      setExpressionDisplay(`${formatResult(inputValue)} ${operatorSymbol}`);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  // Helper function to convert operator to symbol
  const getOperatorSymbol = (op) => {
    switch (op) {
      case "+":
        return "+";
      case "-":
        return "−";
      case "*":
        return "×";
      case "/":
        return "÷";
      default:
        return op;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (operator === "+") {
      return firstOperand + inputValue;
    } else if (operator === "-") {
      return firstOperand - inputValue;
    } else if (operator === "*") {
      return firstOperand * inputValue;
    } else if (operator === "/") {
      if (inputValue === 0) {
        return "Error";
      }
      return firstOperand / inputValue;
    }

    return inputValue;
  };

  const formatResult = (value) => {
    if (typeof value !== "number") return value;

    // Handle very large or small numbers
    if (Math.abs(value) >= 1e12 || (Math.abs(value) < 1e-9 && value !== 0)) {
      return value.toExponential(6);
    }

    const stringValue = value.toString();

    // If the number has many decimal places, limit them
    if (stringValue.includes(".") && stringValue.split(".")[1].length > 10) {
      return value.toFixed(10).replace(/\.?0+$/, "");
    }

    return stringValue;
  };

  const handleEquals = () => {
    if (error) {
      clearAll();
      return;
    }

    if (!operator) return;

    const inputValue = parseFloat(display);
    const result = performCalculation();

    if (result === "Error") {
      setError(true);
      setDisplay("Error");
      setExpressionDisplay("");
      return;
    }

    // Show the complete equation in the expression display
    setExpressionDisplay(
      `${formatResult(firstOperand)} ${getOperatorSymbol(operator)} ${formatResult(inputValue)} =`
    );

    setDisplay(formatResult(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleBackspace = () => {
    if (error) {
      clearAll();
      return;
    }

    if (waitingForSecondOperand) return;

    if (display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercentage = () => {
    if (error) {
      clearAll();
      return;
    }

    const currentValue = parseFloat(display);
    const percentValue = currentValue / 100;
    setDisplay(formatResult(percentValue));

    // Update expression display if we're in the middle of a calculation
    if (operator && firstOperand !== null) {
      setExpressionDisplay(
        `${formatResult(firstOperand)} ${getOperatorSymbol(operator)} ${formatResult(percentValue)}`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Draggable
      handle='.calculator-handle'
      bounds='body'
    >
      <div className='fixed bottom-20 right-6 bg-white rounded-lg shadow-xl z-50 border border-gray-200 w-64'>
        {/* Calculator Header */}
        <div className='flex justify-between items-center px-3 py-2 bg-gray-100 border-b border-gray-200 calculator-handle rounded-t-lg cursor-move'>
          <h3 className='text-sm font-medium text-gray-700'>Calculator (Drag me)</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Calculator Body */}
        <div className='p-3'>
          {/* Expression Display */}
          <div className='bg-gray-50 p-2 text-right rounded-t mb-0.5 border border-gray-200 min-h-[24px] flex items-center justify-end overflow-hidden'>
            <span className='text-sm text-gray-500 text-right w-full overflow-x-auto scrollbar-hide'>
              {expressionDisplay}
            </span>
          </div>

          {/* Result Display */}
          <div className='bg-gray-50 p-2 text-right rounded-b mb-2 border border-gray-200 border-t-0 h-10 flex items-center justify-end overflow-hidden'>
            <span
              className={`text-xl font-medium ${
                error ? "text-red-600" : "text-gray-800"
              } text-right w-full overflow-x-auto scrollbar-hide`}
            >
              {display}
            </span>
          </div>

          {/* Calculator Keys */}
          <div className='grid grid-cols-4 gap-2'>
            <button
              onClick={clearAll}
              className='py-2 px-1 text-center rounded bg-red-100 hover:bg-red-200 transition-colors'
            >
              AC
            </button>
            <button
              onClick={handleBackspace}
              className='py-2 px-1 text-center rounded bg-gray-100 hover:bg-gray-200 transition-colors'
            >
              ⌫
            </button>
            <button
              onClick={handlePercentage}
              className='py-2 px-1 text-center rounded bg-gray-100 hover:bg-gray-200 transition-colors'
            >
              %
            </button>
            <button
              onClick={() => handleOperator("/")}
              className='py-2 px-1 text-center rounded bg-blue-100 hover:bg-blue-200 transition-colors'
            >
              ÷
            </button>

            <button
              onClick={() => inputDigit(7)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              7
            </button>
            <button
              onClick={() => inputDigit(8)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              8
            </button>
            <button
              onClick={() => inputDigit(9)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              9
            </button>
            <button
              onClick={() => handleOperator("*")}
              className='py-2 px-1 text-center rounded bg-blue-100 hover:bg-blue-200 transition-colors'
            >
              ×
            </button>

            <button
              onClick={() => inputDigit(4)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              4
            </button>
            <button
              onClick={() => inputDigit(5)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              5
            </button>
            <button
              onClick={() => inputDigit(6)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              6
            </button>
            <button
              onClick={() => handleOperator("-")}
              className='py-2 px-1 text-center rounded bg-blue-100 hover:bg-blue-200 transition-colors'
            >
              −
            </button>

            <button
              onClick={() => inputDigit(1)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              1
            </button>
            <button
              onClick={() => inputDigit(2)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              2
            </button>
            <button
              onClick={() => inputDigit(3)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              3
            </button>
            <button
              onClick={() => handleOperator("+")}
              className='py-2 px-1 text-center rounded bg-blue-100 hover:bg-blue-200 transition-colors'
            >
              +
            </button>

            <button
              onClick={() => inputDigit(0)}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors col-span-2'
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className='py-2 px-1 text-center rounded hover:bg-gray-100 transition-colors'
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className='py-2 px-1 text-center rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors'
            >
              =
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Calculator;
