import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import { useReducer } from 'react'
import { useEffect } from 'react';
import './App.css'

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE : 'evaluate'
}


function reducer(state, { type, payload }) { 
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0" ) return state
      if(payload.digit === "." && state.currentOperand.includes("." )) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`//help fron ChatGPT
      }
    case ACTIONS.CLEAR:
        return {}
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperrand == null){
        if(payload.operation === "-"){
          return{
            ...state,
            currentOperand: "-",
          }
        }
        return state
      }
      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation,
        }
      } 
 
      if(state.previousOperrand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperrand: state.currentOperand,
          currentOperand: null,
        }
      }
      return{
        ...state,
        overwrite: true,
        previousOperrand: evaluate (state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE:
      if(
        state.currentOperand == null ||
        state.operation == null ||
        state.previousOperrand == null
      ){
        return state
      }
      return{
        ...state,
        overwrite: true,
        previousOperrand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }
      if(state.currentOperand == null){
        return state
      }
      if(state.currentOperand.length === 1){
        return{ ...state, currentOperand: null}
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    default:
      return state;
  }
}
//function that does caluculation (the actual calculator)
function evaluate({ currentOperand, previousOperrand, operation}){
  const prev = parseFloat(previousOperrand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation= prev + current
      break
    case "-":
      computation = prev - current
      break
    case "×":
      computation = prev * current
      break
    case "÷":
        computation = prev / current
      break
  }
  return computation.toString()
}


function App() {
  const[{currentOperand, previousOperrand, operation }, dispatch] = useReducer(reducer,{})

 // dispatch({type: ACTIONS.ADD_DIGIT,payload:{digit: 1}})
 useEffect(() => {
  // Dynamically load the canvas-confetti script from CDN
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);  // Clean up the script when the component is unmounted
  };
}, []);

const triggerConfetti = () => {
  if (window.confetti) {  // Make sure the confetti function is available
    window.confetti({
      particleCount: 200,   // Increase the number of particles
      spread: 360,          // Full spread (360 degrees covers the entire screen)
      startVelocity: 30,    // Speed at which the confetti starts falling
      origin: { y: 0.1 },   // Center of the screen (y: 0.5)
      gravity: 0.5, 
    });
  }
};


  return (
    // Use CSS grids for the arrangement of buttons
    <div className='calculator-grid'> 
    <div className='output'>
      <div className='previous-operand'>{previousOperrand} {operation}</div>
      <div className='current-operand'>{currentOperand}</div>
    </div>
    
    <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
    <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
    <OperationButton operation="÷" dispatch={dispatch}/>
    <DigitButton digit="1" dispatch={dispatch}/>
    <DigitButton digit="2" dispatch={dispatch}/>
    <DigitButton digit="3" dispatch={dispatch}/>
    <OperationButton operation="×" dispatch={dispatch}/>
    <DigitButton digit="4" dispatch={dispatch}/>
    <DigitButton digit="5" dispatch={dispatch}/>
    <DigitButton digit="6" dispatch={dispatch}/>
    <OperationButton operation="+" dispatch={dispatch}/>
    <DigitButton digit="7" dispatch={dispatch}/>
    <DigitButton digit="8" dispatch={dispatch}/>
    <DigitButton digit="9" dispatch={dispatch}/>
    <OperationButton operation="-" dispatch={dispatch}/>
    <DigitButton digit="0" dispatch={dispatch}/>
    <DigitButton digit="." dispatch={dispatch}/>
    <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    
    <div className='confetti'>
    
      <button onClick={triggerConfetti}>&#127881;</button>
    </div>
    </div>
    
  )
   
  
}

export default App
