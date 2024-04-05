const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Cors = require('cors')
const uri = process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.iddsbpm.mongodb.net/schoolportal'


const app = express();
const port = process.env.PORT || 3001


console.log("uri", );
mongoose.connect(uri)
.then(response =>  console.log(`Connected to Mongo Database${response}`))
.catch(err => console.log(`Failed to establish connection to Mongo Database, ${err}`))



app.use(express.json()) 
app.use(Cors())


// Default Api Route    
app.get('/', (req, res, next)=>{
res.send('<Div>Welcome to KadMedia Backend</div>')
})

// app.use('/api/v1/auth', require('./routes/auth'))

app.listen(port, (error)=>{
    if(error){
        console.log(`Failed to connect to server, ${error}`)
    }
    else{
        console.log(`Server is running on port ${port}`)
    }
})