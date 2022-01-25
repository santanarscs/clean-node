import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'
import { SendEmail } from '@/usecases/send-mail'
import { User } from '@/entities'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_email@email.com'
const toName = 'any_email'
const toEmail = 'any_email@email.com'
const subject = ' Test e-mail'
const emailBody = 'Hello world attachment test'
const emailBodyHtml = '<b>Hello world</b>'
const attachments = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} ${fromEmail}`,
  to: `${toName} < ${toEmail} >`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments
}
class MailServiceStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(options)
  }
}
class MailServiceErrorStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email use case', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)

    const user = User.create({ name: toName, email: toEmail }).value as User

    const response = (await useCase.perform(user)).value as EmailOptions
    console.log(response)
    expect(response.to).toEqual(`${toName} < ${toEmail} >`)
  })

  test('should return error when email service fails', async () => {
    const mailServiceStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const user = User.create({ name: toName, email: toEmail }).value as User

    const response = await useCase.perform(user)
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
