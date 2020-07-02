const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./../config/mail')

module.exports = class Email {
     constructor(user, token) {
          this.to = user.email;
          this.token = token;
          this.from = `Afrivac <${process.env.EMAIL_FROM}>`;
     }

     newTransport() {
          return nodemailer.createTransport(config);
     }

     // Send the actual email
     async send(template, subject) {
          // 1) Render HTML based on a pug template
          const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
               token: this.token,
               subject
          });

          // 2) Define email options
          const mailOptions = {
               from: this.from,
               to: this.to,
               subject,
               html,
               text: htmlToText.fromString(html)
          };

          // 3) Create a transport and send email
          await this.newTransport().sendMail(mailOptions);
     }

     async sendWelcome() {
          await this.send('welcome', 'Welcome to the AfricVac!');
     }

     async sendActivate() {
          await this.send(
               'activateAccount', 
               'Your account activation token (valid for only 10 minutes)'
          );
     }

     async sendPasswordReset() {
          await this.send(
               'passwordReset',
               'Your password reset token (valid for only 10 minutes)'
          );
     }
};