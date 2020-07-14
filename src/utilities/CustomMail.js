const sgMail = require('@sendgrid/mail');
const pug = require('pug');
const htmlToText = require('html-to-text');
const email = process.env.FROM_MAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Email {
     // Send the actual email
     async send(data) {
         const from = data.username;
          // 1) Render HTML based on a pug template
          if (!data.template) data.template = "general";

          const html = pug.renderFile(`${__dirname}/../views/email/${data.template}.pug`, {
               message: data.message,
               title: data.title              
          });

          // 2) Define email options
          const msg = {
               to: data.email,
               from: email,
               subject: data.subject,
               text: data.message,
               html,
               text: htmlToText.fromString(html)
             };
          
          // 3) Create a transport and send email
          await sgMail.send(msg);
     }

};

module.exports = new Email();