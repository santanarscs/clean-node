import { Either, left, right } from '../shared/either'
import { Email } from './email'
import { InvalidNameError } from './errors'
import { InvalidEmailError } from './errors/invalid-email-error'
import { Name } from './name'
import { UserData } from './user-data'

export class User {
  public readonly name: Name;

  public readonly email: Email;

  private constructor (name: Name, email: Email) {
    this.name = name
    this.email = email
  }

  static create (userData: UserData): Either<InvalidNameError | InvalidEmailError, User> {
    const nameOrError = Name.create(userData.name)
    const emailOrError = Email.create(userData.email)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email

    return right(new User(name, email))
  }
}
