import { EmailOptions } from '@/usecases/send-mail/ports'

const attachments = [{
  filename: 'text.txt',
  path: '../../resources/text.txt'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Rapheal Santana | <raphaelstn@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME as string,
    password: process.env.EMAIL_PASSWORD as string,
    from,
    to,
    subject: 'Menssagem de teste',
    text: 'Texto da mensagem',
    html: '<b>Texto da mensagem</b>',
    attachments
  }
  return mailOptions
}
