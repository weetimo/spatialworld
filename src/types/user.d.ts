import { Hobby, UserRole } from '../enums'

export interface User {
  id: string
  email: string
  hobbies: Hobby[]
  postalCode: string
  role: UserRole
}
