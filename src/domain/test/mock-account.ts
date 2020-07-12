import { AccountModel } from '@/domain/models/account-model'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import faker from 'faker'

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid(),
})

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})
