//requiring mongoose
const mongoose = require('mongoose')

//loading in the validator npm
const validator = require('validator')

//requiring bcrypt
const bcrypt = require('bcryptjs')

//requiring th JSON webtokesn
const jwt = require('jsonwebtoken')

const Task = require('./task')
//creates a user schema to take advantage of middleware
const userSchema = new mongoose.Schema({
    name :{
        //data validation of type
        type: String,

        //data validation of required types, always requires 
        required: true,
        //no spaces in name
        trim: true
    }, 
    email: {

        type: String,
        unique: true,
        required: true,

        //adding validation for email using the nopm of validator
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email invalid')
            }
        },

        trim: true,
        //converts value to lowercase
        lowercase:true
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6,
        default: 0,
        validate(value){
            if(value.includes('password')){
                throw new Error('Invalid password (should not include password)')
            }
        }


    },
    age: {
        type: Number,
       
        //adding function to validate data
        validate(value) {
            if(value < 0){
                throw new Error('Age must be positive')
            }
        }
    },
    //an array of objects withc each having a token property
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],

   
},{
    //adding timestamps
    timestamps: true
})

//setting up virtual property (relationsip between)
userSchema.virtual('tasks',{
    ref:'Task',
    //local data stored here with ID
    localField: '_id',
    //
    foreignField: 'owner'
})

//delets the user password from sending back
//deletes the tokens as well
//this runs everytime since res.send runs json stringify, json stringify runs this 
userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this

    //creating a token and assinging it from id (conver to String) and the secret sign
    const token = jwt.sign({_id: user._id.toString()},'thisisasecretsign')

    //adding to the array from userSchema
    user.tokens = user.tokens.concat({token: token})

    //calling save to save to database
    await user.save()
    
    return token
}
//creating my own function 
userSchema.statics.findByCredentials = async (email, password) => {
    //finding by email first
    const user = await User.findOne({email: email})

    //if no user of email exists
    if(!user){
        throw new Error ('Unable to login')
    }

    //comparing the hash passwords
    const isMatch = await bcrypt.compare(password, user.password)
    
    //if passowrds dont match
    if (!isMatch){
        throw new Error ('Unable to login')
    }

    return user
}
//allows to do something just before saving
//next recognize the code is over and now save
userSchema.pre('save', async function(next){

    //gives access to individual user
    const user = this
    
    //Checking if the password was modified or not
    if(user.isModified('password')){

        //hasing thr password and updating the password
        user.password = await bcrypt.hash(user.password,8)
    }

    //code finished so call this function
    next()
})

//Deleted tasks when the user is deletd
userSchema.pre('remove', async function(next){
    const user = this

    await Task.deleteMany({owner: user._id})


    next()
})
//creating a new mongoose model, takes in String name and defintion/field object
//mongoose also creates a collection of name 'users' to store instance of its model in mongodb
const User = mongoose.model('User',userSchema)

//exporting User so other files can access
module.exports = User