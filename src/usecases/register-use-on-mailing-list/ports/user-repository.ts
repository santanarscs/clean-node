import { UserData } from '../user-data'

export interface UserRepository {
  add(user: UserData): Promise<UserData>
  findUserByEmail(email: string): Promise<UserData | null>
  findAllUsers(): Promise<UserData[]>
  exists(user: UserData): Promise<boolean>
}
