// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const checkedInitial = () =>
    window.localStorage.getItem('name') === null
      ? initialName
      : JSON.parse(window.localStorage.getItem('name'))

  const [name, setName] = React.useState(checkedInitial)
  console.log(name)
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  function useLocalStorageState(key, value) {
    React.useEffect(() => {
      const stored = JSON.stringify(value)
      window.localStorage.setItem(key, stored)
      console.log(key + ' stored: "' + stored + '"')
    }, [key, value])
  }

  useLocalStorageState('name', name)

  function handleChange(event) {
    setName(event.target.value)
    console.log('Event handled')
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
