const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {
  constructor() {
    // Проверяем, что все переменные окружения определены
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'API_URL'];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Логируем конфигурацию для отладки
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD ? '[REDACTED]' : undefined,
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true для порта 465 (SSL/TLS), false для 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Проверяем соединение с SMTP-сервером
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP connection successful:', success);
      }
    });
  }

  async sendActivationMail(to, link) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Активация аккаунта на ${process.env.API_URL}`,
        text: '', // Текстовую версию можно оставить пустой, если есть html
        html: `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
      });
      console.log(`Activation email sent to ${to}, message ID: ${info.messageId}`);
      return info; // Возвращаем информацию об отправке
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send activation email: ${error.message}`);
    }
  }
}

module.exports = new MailService();
