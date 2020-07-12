import { AccountModel } from '@/domain/models'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'

import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}

  async auth(credentials?: AuthenticationParams): Promise<AccountModel> {
    const response = await this.httpPostClient.post({
      url: this.url,
      body: credentials,
    })

    switch (response.statusCode) {
      case HttpStatusCode.ok:
        return response.body
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}
