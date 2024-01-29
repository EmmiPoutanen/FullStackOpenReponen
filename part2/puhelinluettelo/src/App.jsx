import { useState } from 'react'

const FilterForm = ({ searchValue, handleSearchChange }) => {
  return (
    <div>
      filter shown with
      <input
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addContact }) => {
  return (
    <form onSubmit={addContact}>
      <div>
        name:
        <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:
        <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  )
}


const App = () => {
//Tämä rivi käyttää useState luodakseen tilan nimeltä persons,
//joka alustetaan yhdellä henkilöobjektilla, jonka nimi on 'Arto Hellas'.
//setPersons-funktiota käytetään myöhemmin päivittämään tätä tilaa.
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [searchValue, setSearchValue] = useState('')

  const [filteredNames, setFilteredNames]= useState(persons)

  const addContact = (event) => {
    event.preventDefault()

    const namesSet = new Set(persons.map((person) => person.name))
    const contactObject = {
      name: newName,
      number: newNumber
    }
    if (namesSet.has(newName)){
      alert(`${newName} is already added to phonebook`)
    } else {
//concat yhdistää kaksi tai useampia taulukoita yhdeksi uudeksi taulukoksi,
//mutta se ei muuta alkuperäisiä taulukoita.
      setPersons(persons.concat(contactObject))
      setNewName('')
      setNewNumber('')
      setFilteredNames(persons.concat(contactObject));
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    const searchInput = event.target.value
    setSearchValue(searchInput)

    const filteredItems = persons.filter((person) => person.name.toLowerCase().includes(searchInput.toLowerCase()))
    setFilteredNames(filteredItems)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm searchValue={searchValue} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addContact={addContact}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredNames}/>
    </div>
  )

}

export default App