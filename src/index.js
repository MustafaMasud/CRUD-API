//starting application/ express server

//requiring express
const express = require('express')

//require mongoose file, makes sure mongoose.js runs, and connects to database
require('./db/mongoose')

//Load user in
const User = require('./models/user')

//Load task in
const Task = require('./models/task')

//loading in the User router 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//listening on specific port number
const app = express()
const port = process.env.PORT || 3000


//lets the express server parse incomming JSON data
app.use(express.json())
//registering the different routers
app.use(userRouter)
app.use(taskRouter)

//provides message on terminal 
app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})

