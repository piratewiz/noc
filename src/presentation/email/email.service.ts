import nodemailer from 'nodemailer'
import { envs } from '../../config/plugins/envs.plugin'
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.repository.impl';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments: Attachment[];
}

interface Attachment {
  fileName: string,
  path: string,
}

export class EmailService {

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    }
  });

  constructor( ) {}

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const {to, subject, htmlBody, attachments = []} = options

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      })

      // console.log(sentInformation);
      
      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: 'Email sent',
        origin: 'email.service.ts'
      })

      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: 'Email not sent',
        origin: 'email.service.ts'
      })
      
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = 'Logs Server Files'
    const htmlBody = `
      <h3>System logs Test Noc</h3>
      <p>This is an automatic implementation functionality for test purposes</p>
      <p>See your adjunted logs</p>
    `;

    const attachments: Attachment[] = [
      {fileName: 'logs-all.log', path: './logs/logs-all.log' },
      {fileName: 'logs-high.log', path: './logs/logs-high.log' },
      {fileName: 'logs-medium.log', path: './logs/logs-medium.log' }
    ]

    return this.sendEmail({to, subject, attachments, htmlBody});
  }

}