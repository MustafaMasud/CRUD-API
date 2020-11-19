//loading in library
const jwt = require('jsonwebtoken')

//Loading in User model
const User = require('../models/user')


//authentication middleware
const auth = async (req,res,next) => {
    //try catch to see if user is authenticated
    try{
        
        //getting acces to the token from postman and modifying it
        const token = req.header('Authorization').replace('Bearer ','')
        
        //ensure that token is valid
        const decoded = jwt.verify(token,'thisisasecretsign')
       
        //grabbing the user based of the decoded token and it's ID
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})

        
        //if no user found
        if(!user){
            throw new Error()
        }

        //adding the token so we can use it
        req.token = token
        //this allows to give access to user
        req.user = user

        //if user is found
        next()

    }catch(e){
        res.status(401).send({error: 'Please Authenticate'})
    }
}

//to use middle ware anywhere
module.exports = auth