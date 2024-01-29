/*Määrittele komponentti Course omana moduulinaan, jonka komponentti App importtaa.
Voit sisällyttää kaikki kurssin alikomponentit samaan moduuliin. */
const Course = (props) => {
    return(
      <div>
        <h1>Web development curriculum</h1>
        {props.course.map(course => (
          <div key={course.id}>
          <Header courseName={course.name} />
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
      </div>
      ))}
      </div>
    )
  }

const Header = (props) => {
return(
    <div>
    <h2>{props.courseName}</h2>
    </div>
)
}

const Content = (props) => {
return(
    <div>
    {props.parts.map(part => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
    ))}
    </div>
)
}

const Part = (props) => {
return(
    <div>
    <p> {props.part} {props.exercises}</p>
    </div>
)
}

const Total = (props) => {
// Lasketaan kaikkien numeroiden summa käyttämällä reducea, alustetaan sum nollaksi
const totalExercises = props.parts.reduce((sum, part) =>  sum + part.exercises, 0)
return(
    <div>
    <p>
        Total of {totalExercises} exercises
    </p>
    </div>
)
}

export default Course