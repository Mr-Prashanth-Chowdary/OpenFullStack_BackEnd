const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

const data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const date = new Date()
app.get('/api/persons',(req,res)=>{
    return res.send(data)
})
app.get('/info',(req,res)=> {
    return res.send(`
    <p>Phone book has info of ${data.length} people</p>
    <p>${date.toString()}</p>
    `)
})

app.get('/api/persons/:id',(req,res)=>{
    const person = data.find((person)=>person.id === req.params.id)
    if(person){
        return res.send(person)
    }else{
        return res.status(404).send('The person not found')
    }
})

app.delete('/api/deletepersons/:id',(req,res)=>{
    const person = data.filter((person)=> person.id !== req.params.id)
    data.length = 0
    data.push(...person)
    return res.status(204).end()
})

app.post('/api/addperson',(req,res)=>{
    const {id, name, number} = req.body
    if(data.some((person)=> person.name === name || person.number === number )){
        return res.status(400).send('the person name or number already exist')
    }
    if(name === undefined || name === ""){
        return res.status(400).send('name is not set, name filed required')
    }
    const newObj = {
        id : id, 
        name: name,
        number : number,
    }
    data.push(newObj)
    return res.status(200).send("the person is add to contacts")
})

app.listen(3001,()=>{
    console.log("server is running at 3001")
})