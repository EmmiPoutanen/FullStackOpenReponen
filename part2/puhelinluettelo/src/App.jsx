import { useState, useEffect } from 'react'
import personService from './services/persons'


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


const Persons = ({ persons, searchValue, onDelete }) => {
  const filteredItems = persons.filter((person) =>
    person.name.toLowerCase().includes(searchValue.toLowerCase()
    ))

    return (
      <div>
        {filteredItems.map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => onDelete(person.id)}>Delete</button>
          </div>
        ))}
      </div>
    )
  }

const Notification = ({message, type}) => {
  if (!message) {
    return null
  }

  return(
  <div className={type ?'notification': 'error'}>{message}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [notification, setNotification] = useState(null)
  const [type, setType] = useState(true)

  useEffect(() => {
    personService.getAll()
      .then(response => {
        const initialPersons = response.data
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService.update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person =>
            person.id === existingPerson.id ? response.data : person
          ))
          setNewName('')
          setNewNumber('')
          setNotification(`Updated ${newName}`)
          setTimeout(() => {
            setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setNotification(`Information of ${newName} has aldready been removed from server`, error)
        setType(false)

      })
    }
  } else {
    // Person does not exist, add a new contact
    const newPerson = {
      name: newName,
      number: newNumber
    }

      personService.create(newPerson)
      .then(response => {
        setPersons(prevPersons => [...prevPersons, response.data])
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${newName}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)

      })
      .catch(error => {
        console.error('Error adding contact:', error)
      })

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
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete?")) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
          setNotification('Contact deleted')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
  }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={type}/>
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
      <Persons persons={persons} searchValue={searchValue} onDelete={handleDelete}/>
    </div>
  )

}

export default App