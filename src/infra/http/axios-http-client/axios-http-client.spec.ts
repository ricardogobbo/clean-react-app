import { AxiosHttpClient } from '.'

import axios from 'axios'
import { mockAxios } from '@/infra/test'
import { mockPostRequestParams } from '@/data/test/mock-http-post'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => ({
  sut: new AxiosHttpClient(),
  mockedAxios: mockAxios(),
})

describe('AxiosHttpClient', () => {
  test('Should call axios with correct params', async () => {
    const { sut, mockedAxios } = makeSut()
    const request = mockPostRequestParams()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return correct status code and body', () => {
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(mockPostRequestParams())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
