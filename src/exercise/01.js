// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Greeting({initialName = '', ...props}) {
  // 💣 delete this variable declaration and replace it with a React.useState call
  const [nameState, setName] = React.useState(initialName)
  console.log(props)
  function handleChange(event) {
    setName(event.target.value)
    // 🐨 update the name here based on event.target.value
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {nameState ? <strong>Hello {nameState}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Daniel" lastName="Romero" />
}

export default App
