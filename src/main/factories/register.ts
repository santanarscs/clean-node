import { RegisterAndSendEmailController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { SendEmail } from '@/usecases/send-mail'
import { MongoDbUserRepository } from '@/external/repositories/mongodb'
import { NodemailerEmailService } from '@/external/mail-services'
import { getEmailOptions } from '../config/email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongoDbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const emailService = new NodemailerEmailService()
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService)
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)
  return registerAndSendEmailController
}
