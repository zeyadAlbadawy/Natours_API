const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Zeyad Albadawy <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SandGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SEND_GRID_USERNAME,
          pass: process.env.SEND_GRID_PASSWORD,
        },
      });
      return 1;
    }

    // For API Testing (Mail Trap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send The Actual Mail
    // Render Html Based On Bug Template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        // To Acess these from pug template!
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );
    // Define the mail options
    const sendMailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.convert(html),
    };

    // Create A Transport and send mail-
    await this.createTransport().sendMail(sendMailOptions);
  }

  async sendWelcome() {
    // Bug Template to welcome user
    await this.send('Welcome', 'Welcome to Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token (Valid For 10 min)',
    );
  }
};
