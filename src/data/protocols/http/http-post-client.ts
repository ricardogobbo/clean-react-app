import { HttpResponse } from '@/data/protocols/http/http-response'

export type HttpPostParams = {
  url: string
  body?: object
  response?: HttpResponse
  headers?: any
}

export interface HttpPostClient {
  post(params: HttpPostParams): Promise<HttpResponse>
}
