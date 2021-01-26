const nodemailer = require('nodemailer')

const sendMail = async (options) => {
  //1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  //2. Define the email options
  const mailOptions = {
    from: 'Nguyen Van Tai <tai.nguyen@mail.hoo>',
    to: options.to,
    subject: options.subject,
    text: options.message,
    // html: ,
  }
  //3. Send the mail
  await transporter.sendMail(mailOptions)
}

module.exports = sendMail
