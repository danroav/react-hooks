/* eslint-disable no-undef */
// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [status, setStatus] = React.useState({name: 'idle'})
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (!pokemonName) {
      //setStatus({name: 'idle'})
      return
    }
    console.log('set status pending')
    setStatus({name: 'pending', pokemonName})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        console.log('set status resolved')
        setStatus({name: 'resolved', pokemonName, pokemon: pokemonData})
      },
      error => {
        console.log('set status rejected ')
        setStatus({name: 'rejected', error})
      },
    )
  }, [pokemonName])
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  const resultStatus = {
    idle: () => 'Submit a pokemon',
    pending: () => <PokemonInfoFallback name={status.pokemonName} />,
    resolved: () => <PokemonDataView pokemon={status.pokemon} />,
    rejected: () => {
      throw status.error
    },
  }
  console.log('render status ' + status.name)
  return resultStatus[status.name]()
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}
class ErrorBoundaryPokemonInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }
  static getDerivedStateFromError(error) {
    console.log('Error boundary catch error, update status')
    return {error, hasError: true}
  }
  componentDidCatch(error, errorInfo) {
    console.log(error)
    console.log(errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  function handleSubmit(newPokemonName) {
    console.log('set pokemon name')
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* <ErrorBoundaryPokemonInfo key={pokemonName}> */}
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
        {/* </ErrorBoundaryPokemonInfo> */}
      </div>
    </div>
  )
}

export default App
