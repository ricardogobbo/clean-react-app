import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpStatusCode } from '@/data/protocols/http/http-response'

export class RemoteAuthentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient
  ) {}

  async auth(credentials?: AuthenticationParams): Promise<void> {
    const response = await this.httpPostClient.post({
      url: this.url,
      body: credentials,
    })

    switch (response.statusCode) {
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      case HttpStatusCode.ok:
        break
      default:
        throw new UnexpectedError()
    }
  }
}
