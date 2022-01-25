import { UserData } from '@/entities'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-mail'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'

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
class MailServiceMock implements EmailService {
  public timesSendWasCalled = 0
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timesSendWasCalled++
    return right(options)
  }
}

describe('Register and send email to user', () => {
  test('should register user and send him/her an email with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUserUseCase, sendEmailUseCase)

    const name = 'any name'
    const email = 'any@email.com'

    const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = await repo.findUserByEmail('any@email.com')

    expect(user?.name).toBe('any name')
    expect(response.name).toBe('any name')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })

  test('should not register user and send him/her an email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUserUseCase, sendEmailUseCase)

    const name = 'any_name'
    const invalidEmail = 'invalid_email'

    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as Error
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not register user and send him/her an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUserUseCase, sendEmailUseCase)

    const invalidName = 'a'
    const email = 'email@email.com'

    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email })).value as Error
    expect(response.name).toEqual('InvalidNameError')
  })
})
