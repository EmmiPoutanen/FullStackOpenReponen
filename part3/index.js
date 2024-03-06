require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (persons.find((person) => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    }
    )
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const generateID = () => {
  const randomID = Math.floor(Math.random() * 10000)

  return randomID
}

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const people = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    const info = `<div> ${people}</div> <div> ${date}</div>`
    response.send(info)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)
    if (person) {
    response.json(person)
    } else {
      response.status(204).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
