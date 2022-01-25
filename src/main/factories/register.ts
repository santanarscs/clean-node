import { RegisterAndSendEmailController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MongoDbUserRepository } from '@/external/repositories/mongodb'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongoDbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const registerAndSendEmailController = new RegisterAndSendEmailController(registerUserOnMailingListUseCase)
  return registerAndSendEmailController
}
