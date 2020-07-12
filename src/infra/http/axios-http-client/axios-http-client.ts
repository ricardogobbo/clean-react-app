import { HttpPostParams } from '@/data/protocols/http'

import axios from 'axios'

export class AxiosHttpClient {
  async post(params: HttpPostParams<any>): Promise<void> {
    await axios.post(params.url)
  }
}

/*
import { HttpPostClient, HttpResponse, HttpPostParams } from '@/data/protocols/http'
export class AxiosHttpClient<T, R> implements HttpPostClient<T, R> {
  async post(params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    return Promise.resolve(null)
  }
}
*/
