import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'

import { RemoteAuthentication } from './remote-authentication'
import { HttpStatusCode } from '@/data/protocols/http/http-response'

import {
  HttpPostClientSpy,
  mockResponseWithStatusCode,
} from '@/data/test/mock-http-client'
import { mockAuthentication } from '@/domain/test/mock-authentication'

import faker from 'faker'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClient: HttpPostClientSpy
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClient = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClient)
  return {
    sut,
    httpPostClient,
  }
}

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
})
