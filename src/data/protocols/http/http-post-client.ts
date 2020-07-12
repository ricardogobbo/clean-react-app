export type HttpPostParams = {
  url: string
  body?: object
  headers?: any
}

export interface HttpPostClient {
  post(params: HttpPostParams): Promise<void>
}
