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
    MongoHelper.clearCollection('users')
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
})
