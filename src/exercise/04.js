// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  // 🐨 squares is the state for this component. Add useState for squares
  //const squares = Array(9).fill(null)
  // const [squares, setSquaresState] = React.useState(() => {
  //   console.log(localStorage.getItem('startedGame'))
  //   if (localStorage.getItem('startedGame') === null) {
  //     return Array(9).fill(null)
  //   } else {
  //     return JSON.parse(localStorage.getItem('startedGame'))
  //   }
  // })
  // const [squares, setSquaresState] = useLocalStorageState(
  //   'savedGame',
  //   Array(9).fill(null),
  // )
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  // function selectSquare(square) {
  //   // 🐨 first, if there's already winner or there's already a value at the
  //   // given square index (like someone clicked a square that's already been
  //   // clicked), then return early so we don't make any state changes
  //   if (squares[square] !== null || calculateWinner(squares)) {
  //     return
  //   }
  //   // 🦉 It's typically a bad idea to mutate or directly change state in React.
  //   // Doing so can lead to subtle bugs that can easily slip into production.
  //   //
  //   // 🐨 make a copy of the squares array
  //   // 💰 `[...squares]` will do it!)
  //   const squaresCopy = [...squares]
  //   // 🐨 set the value of the square that was selected
  //   // 💰 `squaresCopy[square] = nextValue`
  //   squaresCopy[square] = calculateNextValue(squares)
  //   // 🐨 set the squares to your copy
  //   setSquaresState(squaresCopy)
  //   localStorage.setItem('startedGame', JSON.stringify(squaresCopy))
  // }

  // function restart() {
  //   // 🐨 reset the squares
  //   // 💰 `Array(9).fill(null)` will do it!
  //   setSquaresState(Array(9).fill(null))
  // }

  // function renderSquare(i) {
  //   return (
  //     <button className="square" onClick={() => selectSquare(i)}>
  //       {squares[i]}
  //     </button>
  //   )
  // }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {/* <button className="restart" onClick={restart}>
        restart
      </button> */}
    </div>
  )
}

function Move({step, currentStep, onGoToMove}) {
  const disabled = currentStep === step
  const buttonText =
    step === 0
      ? `Go to game start` + (disabled ? ` (current)` : ``)
      : `Go to move ${step}` + (disabled ? ` (current)` : ``)

  return (
    <li>
      <button onClick={onGoToMove} disabled={disabled}>
        {buttonText}
      </button>
    </li>
  )
}
function defaultStatus() {
  return {
    history: [Array(9).fill(null)],
    currentStep: 0,
  }
}

function Game() {
  const [state, setState] = useLocalStorageState('status', defaultStatus())
  const stepLength = state['history'].length
  const currentStep = state['currentStep']
  const squares = state['history'][currentStep]
  const moves = []
  const status = renderStatus()
  for (let step = 0; step < stepLength; step++) {
    moves.push(
      <Move
        key={step}
        step={step}
        currentStep={currentStep}
        onGoToMove={() => {
          const newStatus = {...state, currentStep: step}
          console.log(newStatus)
          setState(newStatus)
        }}
      />,
    )
  }
  function renderStatus() {
    return (
      <div className="status">
        {calculateStatus(
          calculateWinner(squares),
          squares,
          calculateNextValue(squares),
        )}
      </div>
    )
  }
  function selectSquare(square) {
    if (squares[square] !== null || calculateWinner(squares)) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = calculateNextValue(squares)
    const stepPlusOne = currentStep + 1
    const historyUntilStep = state['history'].slice(0, stepPlusOne)
    setState({
      history: [...historyUntilStep, squaresCopy],
      currentStep: stepPlusOne,
    })
  }
  function restart() {
    setState(defaultStatus())
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
