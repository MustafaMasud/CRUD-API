//rewuire mongoose
const mongoose = require('mongoose')

//require validator 
const validator = require('validator')

//creating a task model
//mongoose also creates a collection of name 'tasks' to store instance of its model in mongodb
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        //data stored in this is an Object ID
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //allows to create a reference of Model name, to create relationship
        //now you have access to from task
        ref: 'User'
    }
},{
    //adding timestamps
    timestamps: true
})

//finds user associatd with that task, converts just the owner id to the whhole owner profile
// await Task.populate('owner').execPopulate()

// await User.populate('tasks').execPopulate()

const Task = mongoose.model('Task', taskSchema)
//export task so other files can access task
module.exports = Task
 