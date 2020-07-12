import { HttpPostClientSpy } from './../../test/mock-http-client'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClient: HttpPostClientSpy
}

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpPostClient = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClient)
  return {
    sut,
    httpPostClient,
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = 'any-url'
    const { sut, httpPostClient } = makeSut(url)
    await sut.auth()
    expect(httpPostClient.url).toBe(url)
  })
})
