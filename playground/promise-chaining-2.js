//require connection from database
require('../src/db/mongoose')

//require the task model 
const Task = require('../src/models/task')

// //finding task based on promises using ID 
// Task.findByIdAndDelete('5f9607a167a0833038adb095').then((task)=>{
//     console.log(task)

//     //chaining the countDocuments with filter
//     return Task.countDocuments({completed:false})

//     //handling the promise
// }).then((result)=>{
//     console.log(result)

//     //catching error
// }).catch((e)=>{
//     console.log(e)
// })

//implementing async function
const deleteTaskAndCount = async (id) => {

    //assigning contant the promise of deleting taks of id id, also deletes in DB
    const task = await Task.findByIdAndDelete(id)

    //assigning promise of the count documents with completed fileter as true
    const count = await Task.countDocuments({completed: false})

    //send promise 
    return count
}

//calls the function and sends the params to async function, 
deleteTaskAndCount('5f9a38553f88fa3c28218a96').then((count)=>{//handles the promise return

    //prints the count
    console.log(count)
}).catch((e)=>{

    //catches error
    console.log(e)
})
