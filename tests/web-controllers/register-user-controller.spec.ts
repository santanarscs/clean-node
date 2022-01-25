import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { SendEmail } from '@/usecases/send-mail'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

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

class ErrorThrowingUseCaseStub implements UseCase {
  async perform (request: any): Promise<void> {
    throw Error()
  }
}

class MailServiceStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(options)
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
  const mailServiceStub = new MailServiceStub()
  const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)

  const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUserUseCase, sendEmailUseCase)

  const errorThrowingUseCaseStub:UseCase = new ErrorThrowingUseCaseStub()
  const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com'
      }
    }

    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@email.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidName)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'invalid_mail.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing username', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@email.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingName)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing name parameter from request: name.')
  })
  test('should return status code 400 when request is missing email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any name'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingEmail)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing name parameter from request: email.')
  })
  test('should return status code 400 when request is missing name and email', async () => {
    const requestWithMissingNameAndEmail: HttpRequest = {
      body: {
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingNameAndEmail)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing name parameter from request: name email.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com'
      }
    }
    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
