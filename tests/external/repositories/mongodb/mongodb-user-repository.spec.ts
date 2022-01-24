import { MongoHelper } from '@/external/repositories/mongodb/helper'
import { MongoDbUserRepository } from '@/external/repositories/mongodb'

describe('Mongodb user repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })
  test('when user is added, it should exist', async () => {
    const userRepository = new MongoDbUserRepository()
    const user = {
      name: 'any user',
      email: 'any@email.com'
    }
    await userRepository.add(user)
    expect(await userRepository.exists(user)).toBeTruthy()
  })
  xtest('find all should return all added users', async () => {
    const sut = new MongoDbUserRepository()
    await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com'
    })
    await sut.add({
      name: 'a_second_name',
      email: 'a_second_email@mail.com'
    })
    const users = await sut.findAllUsers()
    expect(users[0].name).toEqual('any_name')
    expect(users[1].name).toEqual('a_second_name')
  })
})
