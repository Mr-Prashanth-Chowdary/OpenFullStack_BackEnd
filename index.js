const express = require('express')
const morgan = require('morgan')
const Contact = require('./mongoDB')
const cors = require('cors')
const path = require('path');
const { error } = require('console');

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

app.get('/api/persons/:id',(req,res,next)=>{
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
        next(err)
        // return res.status(500).send("internal server error can't find the user")
    })
})

app.delete('/api/deletepersons/:id',(req,res,next)=>{
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
        next(err)
    })
})

app.put('/api/updateperson/:id',(req,res,next)=>{
    const id = req.params.id
    const updateValues = {
        name:req.body.name,
        number:req.body.number
    }
    Contact.findByIdAndUpdate(id,updateValues,{new:true}).then((dbres)=>{
        return res.json(dbres)
    }).catch(err=>next(err))
});

app.post('/api/addperson', (req, res, next) => {
    const { name, number } = req.body;
  
    // if (!name) {
    //   return res.status(400).send({ error: 'Name is required.' });
    // }
    // if (name.length < 3) {
    //   return res.status(400).send({ error: `Name: Path 'name' ('${name}') is shorter than the minimum allowed length (3)` });
    // }
    
    const nfCheck = (number) => /^\d{3}-\d{3}-\d{4}$/.test(number);
    if (!number || !nfCheck(number)) {
      return res.status(400).send({ error: `Number must be at least 8 digits long in the format '123-123-1324'` });
    }
    
    const newObj = new Contact({
      name,
      number,
    });
  
    newObj.save()
      .then((savedContact) => {
        console.log('Data saved:', savedContact);
        res.status(200).json(savedContact);
      }).catch((err) => next(err));
  });
  
const errorHandel = (err,req,res,next)=>{
    console.log(err);
    if(err.name === 'CastError'){
        return res.status(400).send({error:'maleformatted id'})
    }
    if(err.name === 'ValidationError'){
        return res.status(400).json({error:'PhoneBook validation failed: name: Path `name` is required'})
    }
    next(err)
}
app.use(errorHandel)
const globalErrorHandelar = (err,req,res,next)=>{
    console.error(err.message);
    return res.status(500).json({error:'somthing went wrong'});
}
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

app.listen(3001,()=>{
    console.log("server is running at 3001")
})