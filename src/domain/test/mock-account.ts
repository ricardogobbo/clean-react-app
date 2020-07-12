import { AccountModel } from '@/domain/models'
import { AuthenticationParams } from '@/domain/usecases'
import faker from 'faker'

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid(),
})

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})
