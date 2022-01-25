import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { SendEmail } from '@/usecases/send-mail'
import { MailServiceError } from '@/usecases/errors'

export class RegisterAndSendEmail implements UseCase {
  private readonly registerUserOnMailingList: RegisterUserOnMailingList
  private readonly sendEmail: SendEmail

  constructor (registerUserOnMailingList: RegisterUserOnMailingList, sendEmail: SendEmail) {
    this.registerUserOnMailingList = registerUserOnMailingList
    this.sendEmail = sendEmail
  }

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, User>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const user: User = userOrError.value

    await this.registerUserOnMailingList.perform(user)
    const result = await this.sendEmail.perform(user)
    if (result.isLeft()) {
      return left(result.value)
    }
    return right(user)
  }
}
