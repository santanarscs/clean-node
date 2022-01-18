import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[]

  constructor (repository: UserData[]) {
    this.repository = repository
  }

  async add (user: UserData): Promise<UserData> {
    throw new Error('Method not implemented.')
  }

  async findUserByEmail (email: string): Promise<UserData | null> {
    return null
  }

  async findAllUsers (): Promise<UserData[]> {
    throw new Error('Method not implemented.')
  }

  async exists (user: UserData): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
