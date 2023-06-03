/* eslint-disable no-eval */
import { useState } from "react";
import InputArea from "./InputArea"
import Button from "./Button"
import uuid from 'react-uuid';

export default function App() {

  const entries = ["Mod", "x²", "√x", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "00", "0", ".", "="];
  const typeables = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "×", "÷", "00", ".", "Mod", "x²"];
  const operators = ["+", "-", "×", "÷", "Mod", "x²"]

  // To Track the whole Input
  const [input, setInput] = useState({ expression: ["0"], currentTerm: "0" });
  // To Track if decimal is used in input or not
  const [decimal, setDecimal] = useState(false);

  function updateInput(event) {
    if (event.target.id === "clear") {
      setInput({ expression: ["0"], currentTerm: "0" });
      setDecimal(false);
      return;
    }
    if (event.target.id === "backspace") {
      let { currentTerm } = input;
      let lastInput = currentTerm[currentTerm.length - 1];
      (lastInput === ".") && setDecimal(false);
      setInput((prevInput) => {
        return (prevInput.currentTerm.length === 1) ? { ...prevInput, currentTerm: "0" } : { ...prevInput, currentTerm: prevInput.currentTerm.slice(0, prevInput.currentTerm.length - 1) };
      })
      return;
    }
    if (event.target.id === "square") {
      return evaluateSquare();
    }

    let currentInput = event.target.innerText;

    if (currentInput === "√x") return evaluateSquareRoot();

    // If decimal is used, set decimal to true
    (currentInput === ".") && setDecimal(true);

    // Not Allowing the first characters as multiplication or division signs
    if ((["×", "÷"].includes(currentInput)) && input.currentTerm === "0") return;

    // If the input is typeable, and if it is a valid input given the previous input
    if (typeables.includes(currentInput) && validateInput(currentInput)) {

      // Check if input is Operator
      if (operators.includes(currentInput)) {
        // If operator is used, set decimal to false as decimal can be used again
        updateExpression(currentInput);
        setDecimal(false);
        return;
      }

      setInput((prevInput) => {
        return (prevInput.currentTerm === "0") ? { ...prevInput, currentTerm: currentInput } : { ...prevInput, currentTerm: prevInput.currentTerm + currentInput };
      })
    }
    (currentInput === "=" && input.length !== 0) && evaluateInput();
  }

  function validateInput(currentInput) {
    let lastInput = input.currentTerm[input.currentTerm.length - 1];
    // Conditions on which the input has to be rejected and not to be added to 'currentTerm' state.
    let isDoubleOp = operators.includes(lastInput) && operators.includes(currentInput);
    let isDoubleDecimal = decimal && currentInput === ".";
    let isOpAfterDecimal = lastInput === "." && operators.includes(currentInput);
    let condition = (isDoubleOp) || (isDoubleDecimal) || (isOpAfterDecimal);

    return (condition) ? false : true;
  }

  function updateExpression(operator) {
    setInput((prev) => {
      return { expression: [prev.currentTerm, operator], currentTerm: "0" }
    });
    setDecimal(false);
  }

  function evaluateInput() {

    if (input.expression[0].includes("²")) return evaluateSquare();
    if (input.expression[0].includes("√")) return evaluateSquareRoot();

    let operand1, operator, operand2;
    operand1 = operator = operand2 = "";
    let result = 0;
    let secondComputation = input.expression.length === 4;
    if (secondComputation) {
      operand1 = input.currentTerm;
      operator = changeOperator(input.expression[1]);
      operand2 = input.expression[2];
      result = eval(operand1 + operator + operand2);
      console.log(result);
    }
    else {
      operand1 = input.expression[0];
      operator = changeOperator(input.expression[1]);
      result = eval(operand1 + operator + input.currentTerm)
    }
    result = (Math.round((result + Number.EPSILON) * 100) / 100).toString();
    if (result.includes(".")) setDecimal(true);
    setInput((prev) => {
      return secondComputation
        ? { expression: [prev.currentTerm, prev.expression[1], prev.expression[2], "="], currentTerm: result }
        : { expression: [prev.expression[0], prev.expression[1], prev.currentTerm, "="], currentTerm: result };
    })
  }

  function changeOperator(operator) {
    if (operator === "×") return "*";
    else if (operator === "÷") return "/";
    else if (operator === "Mod") return "%";
    else return operator;
  }

  function evaluateSquare() {
    let result = input.currentTerm * input.currentTerm;
    result = (Math.round((result + Number.EPSILON) * 100) / 100).toString();
    setInput((prev) => {
      return { expression: [prev.currentTerm + "²", "="], currentTerm: result }
    })
  }

  function evaluateSquareRoot() {
    let result = Math.sqrt(input.currentTerm);
    result = (Math.round((result + Number.EPSILON) * 100) / 100).toString();
    if (result.includes(".")) setDecimal(true);
    setInput((prev) => {
      return { expression: ["√" + prev.currentTerm, "="], currentTerm: result }
    })
  }

  return (
    <div className="container">

      <InputArea expression={input.expression} term={input.currentTerm} />

      <button onClick={updateInput} id="clear" className="all-clear-btn button">AC</button>
      <button onClick={updateInput} id="backspace" className="backspace-btn button">⌫</button>

      {entries.map((entry, index) => {
        return <Button key={uuid()} value={entry} onClick={updateInput} />
      })}

    </div>
  )
}
