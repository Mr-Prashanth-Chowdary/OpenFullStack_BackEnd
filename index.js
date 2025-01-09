const express = require('express')
const morgan = require('morgan')
const Contact = require('./mongoDB')
const cors = require('cors')
const path = require('path');

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

// const data = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]



const date = new Date()
app.get('/api/persons',(req,res)=>{
    Contact.find({}).then((contacts)=>{
        return res.json(contacts)
    })
})
app.get('/info',(req,res)=> {
    return res.send(`
    <p>Phone book has info of ${data.length} people</p>
    <p>${date.toString()}</p>
    `)
})

app.get('/api/persons/:id',(req,res)=>{
    // const person = data.find((person)=>person.id === req.params.id)
    // if(person){
    //     return res.send(person)
    // }else{
    //     return res.status(404).send('The person not found')
    // }
    const id = req.params.id
    Contact.findById({_id:id}).then((dbres)=>{
        if(dbres){
            return res.json(dbres)
        }
        else{
            return res.status(404).send(`<h1>404 Page not Found</h1>`)
        }
    }).catch((err)=>{
        console.log(err)
        return res.status(500).send("internal server error can't find the user")
    })
})

app.delete('/api/deletepersons/:id',(req,res)=>{
    const id = req.params.id
    // const person = data.filter((person)=> person.id !== req.params.id)
    // data.length = 0
    // data.push(...person)
    Contact.deleteOne({_id:id})
    .then((dbres)=>{
        if(dbres.deleteCount === 0){
           return res.status(404).send('contact not found');
        }
        return res.status(200).end()
    })
    .catch((err)=>{ 
        return res.status(500).send('server error can not delete the contact',err)
    })
})

app.post('/api/addperson',(req,res)=>{
    const {name, number} = req.body
    // if(data.some((person)=> person.name === name || person.number === number )){
    //     return res.status(400).send('the person name or number already exist')
    // }
    if(name === undefined || name === ""){
        return res.status(400).send('name is not set, name filed required')
    }
    const newObj = new Contact({
        name: name,
        number : number,
    })
    newObj.save().then((res)=>{
        console.log('data saved',res)
    })
    // data.push(newObj)
    return res.status(200).send(newObj)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
app.listen(3001,()=>{
    console.log("server is running at 3001")
})