// // CRUD create(insert) read(find) update(update) delete, first connection (direct with Mongo Db)
// // Requiring module and driver
// //gives necessary funtion to connect to the database
// //provides option to generate ID
// const {MongoClient, ObjectID} = require('mongodb')

// //connects to local host server running Mongodb
// const connectionURL = 'mongodb://127.0.0.1:27017 '

// //Database name
// const databaseName = 'task-manager'

// //adding a new ID created
// const id = new ObjectID()

// //Connection
// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
//     //if connection fails
//     if (error){
//         return console.log('Unable to connect')
//     }
//     //if connection succeeds
//     console.log('Success!')

//     //reference the database to manipulate and store in 'db'
//     const db = client.db(databaseName)
    
//     // //filtering data using 
//     // db.collection('users').findOne({_id: new ObjectID("5f92376ab88ad25bc0f905d2")},(error, user)=>{
//     //     if (error){
//     //         return console.log('Unable to fetch')

//     //     }

//     //     console.log(user)
//     // })

//     // db.collection('users').find({ age: '20' }).toArray((error,users)=>{
//     //     if(error){
//     //         return console.log('Unaivalable')
//     //     }
//     //     console.log(users)
//     // })

//     // db.collection('tasks').findOne({_id: new ObjectID("5f923bdf37c8ed5458e9dbbd")},(error,result)=>{
//     //     if(error){
//     //         return console.log("Unavailable")
//     //     }

//     //     console.log(result)
//     // })

//     // db.collection('tasks').find({completed: true}).toArray((error, result)=>{
//     //     console.log(result)
//     // })

//     // //updating one document in Mongo using Promise
//     // db.collection('users').updateOne({_id: new ObjectID("5f923585ad94107ba4feed78")},
//     // {$set: {name:"Mominah"}}).then((result)=>{
//     //     console.log(result)
//     // }).catch((error)=>{
//     //     console.log('Error')
//     // })

//     //updating many documents at once in Mongo with promise
// //     db.collection('tasks').updateMany({completed: true},{ $set:{completed:false}}).then((result)=>{
// //         console.log(result)
// //     }).catch((error)=>{
// //         console.log(error)
//     // })

//     //deleting one document from MongoDb
// //     db.collection("users").deleteOne({name: 'Mominah'}).then((result)=>{
// //         console.log(result)
// //     }).catch((error)=>{
// //         console.log(error)
// //     })
// })
