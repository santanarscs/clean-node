import { User } from '@/entities'
import { Either } from '@/shared'
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

  async perform (request: User): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E ai <br> ${request.name}</b>, beleza?`
    const customizeHtml = `${greetings}<br><br> ${this.emailOptions.html}`
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${request.name.value} < ${request.email.value} >`,
      html: customizeHtml
    }
    return await this.emailService.send(emailInfo)
  }
}
