import { User } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (request: any): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, EmailOptions>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const greetings = `E ai <br> ${request.name}</b>, beleza?`
    const customizeHtml = `${greetings}<br><br> ${this.emailOptions.html}`
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${request.name} < ${request.email} >`,
      html: customizeHtml
    }
    return await this.emailService.send(emailInfo)
  }
}
