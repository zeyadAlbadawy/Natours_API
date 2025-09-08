const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const sgMail = require('@sendgrid/mail');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Zeyad Albadawy <${process.env.EMAIL_FROM}>`;
  }

  // For local dev (Mailtrap)
  createDevTransport() {
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
    // Render HTML from Pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    if (process.env.NODE_ENV === 'production') {
      // ✅ Use SendGrid in production
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: this.to,
        from: this.from, // must be a verified sender in SendGrid
        subject,
        html,
        text: htmlToText.convert(html),
      };

      try {
        await sgMail.send(msg);
      } catch (err) {
        console.error('❌ SendGrid Error:', err.response?.body || err.message);
        throw err;
      }
    } else {
      // ✅ Use Mailtrap in development
      const transport = this.createDevTransport();
      await transport.sendMail({
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      });
    }
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (Valid For 10 min)',
    );
  }
};
