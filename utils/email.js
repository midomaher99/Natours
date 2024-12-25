const nodemailer = require("nodemailer");
const catchAsync = require(`${__dirname}/catchAsync`)

sendEmail = catchAsync(async (options) => {
    //create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false
    })
    //define email options
    const mailOptions = {
        from: 'Mohamed Mostafa <admin@natours.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //send the email;
    await transporter.sendMail(mailOptions)
})

module.exports = sendEmail;