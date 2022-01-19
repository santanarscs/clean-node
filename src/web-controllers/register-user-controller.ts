import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { created, badRequest } from '@/web-controllers/util'
import { MissingParamError } from './errors/missing-param-error'

export class RegisterUserController {
  private readonly useCase: RegisterUserOnMailingList

  constructor (useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    const userData: UserData = request.body

    if (!request.body.name || !request.body.email) {
      let missingParam = !request.body.name ? 'name ' : ''
      missingParam += !request.body.email ? 'email' : ''
      return badRequest(new MissingParamError(missingParam.trim()))
    }

    const response = await this.useCase.registerUseOnMailingList(userData)

    if (response.isLeft()) {
      return badRequest(response.value)
    }

    if (response.isRight()) {
      return created(response.value)
    }

    return {
      statusCode: 500,
      body: {}
    }
  }
}
