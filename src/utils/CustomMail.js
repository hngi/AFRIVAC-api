const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('../config/mail')

class Email {

     newTransport() {
          return nodemailer.createTransport(config);
     }

     // Send the actual email
     async send(data) {
         const from = data.from.split('@')[0];
          // 1) Render HTML based on a pug template
          const html = pug.renderFile(`${__dirname}/../views/email/general.pug`, {
               message: data.message,
               title: data.title              
          });

          // 2) Define email options
          const mailOptions = {
               from: `${from} <${data.from}>`,
               to: data.to,
               subject: data.header,
               html,
               text: htmlToText.fromString(html)
          };

          // 3) Create a transport and send email
          await this.newTransport().sendMail(mailOptions);
     }

};

module.exports = new Email();