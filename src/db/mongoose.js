//requiring mongoose
const mongoose = require('mongoose')


//connection to Mongo database, takes in URL and name
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,

    //index are created, quickly acces data
    useCreateIndex: true,
    useFindAndModify:false,
    useUnifiedTopology: true 
})



//creating instant of model User
// const Mustafa = new User ({
//     name: '   Mustafa   Mohsin',
//     email:'mustafa.mohsiny@gmail.com',
//     password: 'pas3'
// })

// //saving the data stored, returns promise while save runs
// Mustafa.save().then(()=>{
//     console.log(Mustafa)
// }).catch((error)=>{
//     console.log('Error', error)
// })


// // creating instance of model tasks
// const myTask = new Task({
//     description: 'eat'
    
// })

// // //saving the instance in database
// myTask.save().then(()=>{
//     console.log(myTask)
// }).catch((error)=>{
//     console.log('Error', error)
// })