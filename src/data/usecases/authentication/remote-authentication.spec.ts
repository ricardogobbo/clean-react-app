import { RemoteAuthentication } from '.'

import { AccountModel } from '@/domain/models'
import { AuthenticationParams } from '@/domain/usecases'
import { UnexpectedError, InvalidCredentialsError } from '@/domain/errors'
import { mockAuthentication, mockAccountModel } from '@/domain/test'

import { HttpResponse, HttpStatusCode } from '@/data/protocols/http'
import { HttpPostClientSpy } from '@/data/test'

import faker from 'faker'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClient: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClient = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClient)
  return {
    sut,
    httpPostClient,
  }
}

const mockResponseWithStatusCode = (statusCode: HttpStatusCode): HttpResponse<AccountModel> => ({
  statusCode: statusCode,
})

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClient } = makeSut(url)
    await sut.auth()
    expect(httpPostClient.url).toBe(url)
  })

  test('Should call HttpClient with correct body', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    await sut.auth(authParams)
    expect(httpPostClient.body).toEqual(authParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostClient return 401', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    const response = mockResponseWithStatusCode(HttpStatusCode.unauthorized)
    httpPostClient.response = response
    const promise = sut.auth(authParams)
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 400', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    const response = mockResponseWithStatusCode(HttpStatusCode.badRequest)
    httpPostClient.response = response
    const promise = sut.auth(authParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 404', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    const response = mockResponseWithStatusCode(HttpStatusCode.notFound)
    httpPostClient.response = response
    const promise = sut.auth(authParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 500', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    const response = mockResponseWithStatusCode(HttpStatusCode.serverError)
    httpPostClient.response = response
    const promise = sut.auth(authParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel when HttpPostClient Returns 200', async () => {
    const { sut, httpPostClient } = makeSut()
    const authParams = mockAuthentication()
    const accountModel: AccountModel = mockAccountModel()

    httpPostClient.response = mockResponseWithStatusCode(HttpStatusCode.ok)
    httpPostClient.response.body = accountModel

    const response = await sut.auth(authParams)
    await expect(response).toEqual(accountModel)
  })
})
