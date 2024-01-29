import { useState } from 'react'

const Statistics = (props) => {
  if (props.sum == 0) {
    return(
      <div>
        No feedback given
      </div>
  )
  }

  return (
    <div>
      <StatisticLine text = "Good" value={props.good}/>
      <StatisticLine text = "Neutral" value={props.neutral}/>
      <StatisticLine text = "Bad" value={props.bad}/>
      <StatisticLine text = "All" value={props.sum}/>
      <StatisticLine text = "Average" value={props.average.toFixed(2)}/>
      <StatisticLine text = "Positive" value={props.positivePercentage.toFixed(2)}/>
    </div>

  )
}

const StatisticLine = (props) => {
  return(
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )
}

const Button = (props) => {
  return (
    <div>
      <button onClick= {props.setGood}>
        {props.text1}
      </button>

      <button onClick= {props.setNeutral}>
        {props.text2}
      </button>

      <button onClick= {props.setBad}>
        {props.text3}
      </button>
    </div>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const sum = bad + good + neutral;

  const average = (good * 1 + neutral * 0 + bad * -1 ) / sum;

  const positivePercentage = (good / sum) * 100;


  return (
    <div>
      <h1>
        Give feedback
      </h1>
      <Button setGood= {() => setGood(good + 1)} text1="good" setNeutral= {() => setNeutral(neutral + 1)} text2="neutral" setBad={() => setBad(bad + 1)} text3="Bad"/>
      <h2>
        Statistics
      </h2>
      <Statistics good={good} neutral={neutral} bad={bad} sum={sum} average={average} positivePercentage={positivePercentage} />
    </div>
  )
}

export default App