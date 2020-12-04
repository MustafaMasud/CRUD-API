//requiring express library
const express = require('express')

//requirig the mongose User model
const User = require('../models/user')

//creating the new router
const router = new express.Router()

//adding the auth middleware for this specific route
const auth = require('../middleware/auth')

//adding the multer npm
const multer = require('multer')

//requiring sharp
const sharp = require('sharp')

//post creats a new user in 'User', when user uses http method of post(with url) then this API sends back a message 'testing'
//adding async allows to use await

router.post('/users',async (req,res)=>{
    //creates new instance of User using JSON data provided in request in postman
    const user = new User(req.body)

    //using await
    //using the try catch to catch any individual errors
    try{

        //generating the token for user
        const token = await user.generateAuthToken()

        //no return value needed, as no constant needed
        await user.save()

        //sending status and user
        res.status(201).send({user,token})

        //catching errors
    } catch(e){
        //sending status back
        res.status(400).send(e)
    }

    //using promises 
    // //saving to database 
    // user.save().then(()=>{
        
    //     //changing status
    //     res.status(201)
    //     //sending the user the user created
    //     res.send(user)
    // }).catch((e)=>{
    //     //change the status code before sending error
    //     res.status(400)

    //     //catching error and sending back the error
    //     res.send(e)
       
    // })
})

//setting up login for users 
//the middleware auth is added as the second arguement
router.post('/users/login', async(req, res)=>{
    try{
        //calling a new method we set up
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //setting up JWT Token and send sto user
        const token = await user.generateAuthToken()
        //send back the User property and token property
        //creating our own funciton on user to display 
        res.send({user: user, token})
    }catch(e){
        res.status(400).send()
    }
})

//creating the logout
router.post('/users/logout', auth, async(req,res)=>{
    try{
        //removes the token that leads to return a false
        //only removes the token logging out from, does not logout all
        //if token = the token used then we remove it, thus deleting authentication
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        //saving to the db
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//for logging out of all sessions
router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        //clearing the tokens array
        req.user.tokens = []

        //saving the changes
        await req.user.save()

        //sending back status
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
//reading the specific user
//only runs if authentications
router.get('/users/me', auth, async (req,res)=>{

    res.send(req.user)
    // //trying the await function 
    // try{
    //     //sending users found
    //   const users =   await User.find({})
    //     res.status(200).send(users)

    // //cathcing any errors
    // }catch(e){
    
    //     res.status(500).send()
    // }
    // // //getting all users in database
    // // User.find({}).then((users)=>{

    // //     //sending back array of users
    // //     res.send(users)

    // //     //catch if things go wrong
    // // }).catch((e)=>{

    // //     //send back internal error status
    // //     res.status(500).send()
    // // })

})

// //To get specific user, use params ':id' then call back function 
// router.get('/users/:id',async (req,res)=>{

//     //'id' from above is stored here
//     const _id = req.params.id

//     //try to run the find by ID await function
//     try{
//         //assigning the promise to user
//         const user = await User.findById(_id)

//         //if user doens't exist
//         if(!user){
//             return res.status(404).send()
//         }
//         //sneding status and user
//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send()

//     }
    
//     // //finding user by Id from above
//     // User.findById(_id).then((user)=>{

//     //     //if user doesnt exist by id
//     //     if(!user){

//     //         //user not found error
//     //         return res.status(404).send()
//     //     }

//     //     //otherwise send user
//     //     res.send(user)
//     // }).catch((e)=>{

//     //     //other internal error
//     //     res.status(500).send()
//     // })

// })

//updating a user with specific ID
router.patch('/users/me', auth, async (req,res)=>{

    //returns array of fields in that object
    const updates = Object.keys(req.body)
    
    

    //handling custom errors, such as changes non exisiting fields
    //alowed to update this, in array 
    const allowedUpdates = ['name', 'email','password', 'age']

    //makes sure al
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    //trying the await function
    try{
        //finds by ID '_id' and takes in JSON body from postman for updates and returns new User instead of old
       //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
    //    const user = await User.findByIdAndUpdate(req.params.id)

       //runs forEach on each item on updates list
       updates.forEach((update)=>{
        //updating the user field to the request from JSON postman
        req.user[update] = req.body[update]
       })

       //saving the user
       await req.user.save()
    
        //no user with update
        // if (!user){
        //     return res.status(404).send(e)
        // }
        //Update went well so send back user
        res.status(200).send(req.user)

        //Update went poorly

    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth,  async (req,res)=>{
    try{
        // //deleting the user of id from request
        // const user = await User.findByIdAndDelete(req.user._id)

        // //if no user exists of id
        // if(!user){
        //     return res.status(404).send({error: " No user found"})
        // }
        //removes the user
        await req.user.remove()
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

//configure multer
const upload = multer({

    //restricts the file size
    limits: {
        fileSize: 1000000
    },
    //allows to filter the file types
    fileFilter(req, file, cb){
        //if the file does not match the file extensions
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload an image file'))
        }
        
        //if it does match
         cb(undefined, true)

    }
})

//router to upload profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'),async(req,res)=>{
    //multer data is accessible here
    //setting the user avatar to the beffer data from multer

    //gave sharp data about the file
    //converts this to a png and resizes
    //sends back the binary data that sharp provides
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.status(200).send()
},//error hanlder to customize multer errors
(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

//adding delete funciton in the avatars
router.delete('/users/me/avatar', auth, async(req,res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

//fetching the avatar
router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
//export the router so index.js can use it
module.exports = router