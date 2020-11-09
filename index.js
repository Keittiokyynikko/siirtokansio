const express = require('express')
const app = express()
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const list = persons.length
  const date = new Date()
  res.send('<p>Phonebook has info for ' + list + ' people</p>' + date)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const num = persons.find(per => per.id === id)

  if (num) {
    res.json(num)
  } else {
    res.status(404).end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if(!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  } else if(persons.find(n => n.name == body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.find(per => per.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})
