import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from './helper'

export class MongoDbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    const exists = await this.exists(user)
    if (!exists) {
      await userCollection.insertOne(user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.findOne({ email })
    return result as unknown as UserData
  }

  async findAllUsers (): Promise<UserData[]> {
    const userCollection = MongoHelper.getCollection('users')
    return await userCollection.find().toArray() as unknown as UserData[]
  }

  async exists (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)
    if (!result !== null) {
      return true
    }
    return false
  }
}
