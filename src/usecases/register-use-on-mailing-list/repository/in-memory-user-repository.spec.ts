import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In memory user repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@mail.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@email.com'
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user?.name).toBe('any_name')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [{ name: 'first', email: 'first@email.com' }, { name: 'second_name', email: 'second@email.com' }]
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    const returnedUsers = await userRepo.findAllUsers()
    expect(returnedUsers.length).toBe(2)
  })
})
