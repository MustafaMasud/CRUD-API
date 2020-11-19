const { Router } = require('express')
//requiring express
const express = require('express')

//requiring the mongoose model
const Task = require('../models/task')

//ading the auth middleware
const auth = require('../middleware/auth')
//creating the new router
const router = new express.Router()

//creating new Task
router.post('/tasks',auth, async (req,res)=>{

    //creating new task based from JSON data given by client
    const task = new Task({
        //copies all properties from body to this object
        ...req.body,

        //adding the owner to the mix (hardcode)
        owner: req.user._id
    })

    //using await to save the task created in the DB
    try{
        //saving the user using await
        await task.save()
        //sending the status and task
        res.status(200).send(task)

        //catching errors
    }catch(e){
        
        //sending error status
        res.status(500).send(e)
     
    }

    // //saving the task and handling response
    // task.save().then(()=>{
    //     //send the newly created task to client
    //     res.status(201).send(task)

    // }).catch((e)=>{
    //     //sending error and changing status
    //     res.status(400).send(e)
    // })

})

//sorting and other queries
// GET /tasks?completed=true
// GET /tasks?limit=1&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res)=>{
    //contains the completed value 
    const match ={}
    const sort = {}

    //if the query exists
    if(req.query.completed){
        //set this property to the boolean
        match.completed = req.query.completed === 'true' 
    }

    //if the sorting query exists
    if(req.query.sortBy){
        //splitting the string into two where ':' appears
        const parts = req.query.sortBy.split(':')
        //dynamically setting sort.something to an ascending or descending order
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    //trying the await function to find in DB
    try{
        //assigning task as promise find
        await req.user.populate({
            //sets path to the tasks
            path: 'tasks',
            //sets the match property to match object
            match: match,
            //adding pagnition and setting task limit
            options: {
                //converts the string to int and sets limit to that number
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                //sorting by created at in descending order
                sort: sort
            }
            
        }).execPopulate()
        
        //sending status and tasks found
        res.status(200).send(req.user.tasks)
    }catch(e){
        //sending error
        res.status(500).send()
    }
    
    

    // //find all tasks within the db
    // Task.find({}).then((tasks)=>{

    //     //sends back the tasks found
    //     res.send(tasks)
    // }).catch((e)=>{
    //     ///catches internal error
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req,res)=>{

    //getting id for the task in 'id' param
    const _id = req.params.id

    //trying the await function to find by ID
    try{
        //finding task using the owner associated with it 
        const task = await Task.findOne({_id, owner: req.user._id})
        //if no tasks of id
        if(!task){
            //Bad request error
            res.status(404).send()
        }
        //send task if found
        res.status(200).send(task)
    }catch(e){
        //send error
        res.status(500).send(e) 
    }
    // //finding tasks by query using id
    // Task.findById(_id).then((task)=>{

    //     //if tasks is an empty array and message
    //     if(!task){
    //        return res.status(404).send('task not found')
    //     }
    //     //otherwise send back task
    //     res.send(task)
    // }).catch((e)=>{
    //     //catch internal error and message
    //     res.status(500).send('internal error')
    // })
})

//updating tasks
router.patch('/tasks/:id', auth, async(req,res)=>{
    //getting id for the task in 'id' param
    const _id = req.params.id

    //returns array of fields in that object
    const updates = Object.keys(req.body)

    //array of allowed changes of field
    const allowedUpdates = ['description','completed']

    //checks if above array has one of the item in array
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    //if not 
    if(!isValidOperation){
        return res.status(404).send({error:'Invalid Update'})
    }

    try{
        //finding by ID and updating the document
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new:true, runValidators:true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

       
        //if no tasks of id found
        if(!task){
            return res.status(404).send({error: 'No task found'})
        }

         //cycvles through the arrray 
         updates.forEach((update)=>{
            //sets the propoerty being updated to the request sent by JSON postman
            task[update]=req.body[update]

        })

        //saving the file
        await task.save()
        //if found send back the task
        res.status(200).send(task)
    }catch(e){
        //catching error
        res.status(400).send(e)
    }
})

//deleting task
router.delete('/tasks/:id', auth, async (req,res)=>{

    try{
        //take in task id and owner id
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send({error:"task not found"})
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//exporting the rputer so index.js can use it
module.exports = router