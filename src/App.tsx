import React from "react"
import './App.css'
import Quizz from "./components/Quiz"

type setState = (arg0: boolean) => void

function App() {

  const [hasStarted, setHasStarted] = React.useState(false)

  return (
    <div>
      { 
        hasStarted ?
        <Quizz /> :
        <StartScreen setHasStarted={setHasStarted}/>
      }
    </div>
  )
}

export default App

type startScreenProps = {
  setHasStarted: setState,
}
function StartScreen(props: startScreenProps) {

  return (
    <div className="start--hub">
      <h1>Quizzical</h1>
      <p>Trivia game</p>
      <button className="start-quiz-button" onClick={() => props.setHasStarted(true)}>Start Quizz</button>
    </div>
  )
}