import { UserData } from '@/entities'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { created, badRequest, serverError } from '@/web-controllers/util'
import { MissingParamError } from './errors/missing-param-error'

export class RegisterUserController {
  private readonly useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const userData: UserData = request.body

      if (!request.body.name || !request.body.email) {
        let missingParam = !request.body.name ? 'name ' : ''
        missingParam += !request.body.email ? 'email' : ''
        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const response = await this.useCase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      if (response.isRight()) {
        return created(response.value)
      }
    } catch (error) {
      return serverError(error)
    }
    return serverError('')
  }
}
