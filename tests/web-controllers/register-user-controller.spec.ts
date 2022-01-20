import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserController } from '@/web-controllers'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

class ErrorThrowingUseCaseStub implements UseCase {
  async perform (request: any): Promise<void> {
    throw Error()
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
  const errorThrowingUseCaseStub:UseCase = new ErrorThrowingUseCaseStub()
  const controller: RegisterUserController = new RegisterUserController(useCase)

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
    const controller: RegisterUserController = new RegisterUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
