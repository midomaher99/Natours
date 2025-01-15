const nodemailer = require("nodemailer");
const catchAsync = require(`${__dirname}/catchAsync`);
const pug = require('pug');
const htmlToText = require('html-to-text')
/*
    class
    constructor 
    new transporter
    send 
    send welcome
*/
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.from = `Mohamed Mostafa <${process.env.EMAIL_FROM}>`;
        this.url = url;
        this.firstName = user.name.split(' ')[0];
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                },
                secure: false
            })
        }
        development
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false
        })

    }
    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        //send the email;
        await this.newTransport().sendMail(mailOptions)
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours Family!');
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token valid for only 10 min');
    }
}