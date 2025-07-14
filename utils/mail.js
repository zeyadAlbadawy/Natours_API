const nodemailer = require('nodemailer');

const sendEmail = async (opt) => {
  // Create Transport
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const sendMailOptions = {
    from: 'Zeyad Albadawy <zeyadalbadawy@gmail.com>',
    to: opt.email,
    subject: opt.subject,
    text: opt.message,
  };

  await transport.sendMail(sendMailOptions);
};

module.exports = sendEmail;
