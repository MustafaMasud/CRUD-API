//requires mongodb databse connection
require('../src/db/mongoose')

//grabbing th model working with
const User = require('../src/models/user')

//grabbing the id of user updating 5f9605bc50e9629ac0ca3c80

// //finding by Id and updating the document using promise chaining
// User.findByIdAndUpdate('5f9a308e8122318274c02874', {age: 21}).then((user)=>{

//     //printing to the console
//     console.log(user)

//     //promise chains and returns filtered document count
//     return User.countDocuments({age:21})
// }).then((result)=>{
//     //chains result
//     console.log(result)
// }).catch((e)=>{

//     //catches any error
//     console.log(e)
// })

//finding by using Async await 

//creating new async function to read user and count documents
const updateAgeAndCount = async (id, age) => {

    //assigning constants to promise 
    const user = await User.findByIdAndUpdate(id, { age})
    const count = await User.countDocuments({age})

    //returns count promise
    return count
}

//calling the function here with params id and age 
updateAgeAndCount('5f9605bc50e9629ac0ca3c80',22).then((count)=>{ //handling the count return from promise
    console.log(count)
}).catch((e)=>{ //catching error
    console.log(e)
})