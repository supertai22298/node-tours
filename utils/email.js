const nodemailer = require('nodemailer')
const pug = require('pug')
const { htmlToText } = require('html-to-text')

// const sendMail = async (options) => {
//   //1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   })

//   //2. Define the email options
//   const mailOptions = {
//     from: 'Nguyen Van Tai <tai.nguyen@mail.hoo>',
//     to: options.to,
//     subject: options.subject,
//     text: options.message,
//     // html: ,
//   }
//   //3. Send the mail
//   await transporter.sendMail(mailOptions)
// }

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = process.env.MAIL_FROM
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  }

  async send(template, subject) {
    // 1. Render email
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    )
    // 2. Defire email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    }
    // 3. Create a transport and send an email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    )
  }
}
