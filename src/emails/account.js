const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail= (email, name ) =>{

    sgMail.send({
        to: name,
        from: 'mustafa.mohsiny@gmail.com',
        subject: 'Thanks for joining us!',
        text: `Welcome to the App ${name}`
    })
}

const sendCancelEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'mustafa.mohsiny@gmail.com',
        subject: 'Deleting account',
        text: `Dear ${name}, you have deleted your account!`
    })
}

//for sending multiple exports
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
