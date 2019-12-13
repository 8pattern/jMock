import { getLegalMethod, exactMatchRoute, fuzzyMatchRoute, regMatchRoute, MatchParam } from './util'

interface MockCallback {
  (msg: object | string): void
}

interface MockFn {
  (callback: MockCallback, ...args: unknown[]): void
}

export type ValidMockParam = object | string | MockFn

interface MockContent {
  [method: string]: ValidMockParam
}

export interface MockData {
  [url: string]: MockContent
}

export default class MockCollection {
  private data: MockData = {}

  constructor(mockData: MockData = {}) {
    this.load(mockData)
  }

  load(mockData: MockData = {}) {
    Object.keys(mockData)
      .forEach((url) => {
        const mockContent = mockData[url]
        Object.keys(mockContent)
          .forEach((method) => {
            const content = mockContent[method]
            this.set(url, method, content)
          })
      })
  }

  set(url: string, method: string, content: ValidMockParam): void {
    const { data } = this
    const legalMethod = getLegalMethod(method)
    data[url] = data[url] || {}
    data[url][legalMethod] = content
  }

  delete(url: string, method: string): boolean {
    const { data } = this
    const legalMethod = getLegalMethod(method)
    if (data[url] && data[url][legalMethod]) {
      Reflect.deleteProperty(data[url], legalMethod)
      return true
    }
    return false
  }

  get(urlPattern: string, method: string): [ValidMockParam, MatchParam] | null {
    const legalMethod = getLegalMethod(method)
    let matchFn = [exactMatchRoute, fuzzyMatchRoute, regMatchRoute]
    let matchResult: [ValidMockParam, MatchParam] | null = null

    Object.entries(this.data)
      .forEach(([url, mockContent]) => {
        matchFn.some((fn, index) => {
          const matchRes = fn(url, urlPattern)
          matchResult = [mockContent[legalMethod], matchRes.param]
          matchFn = matchFn.slice(0, index)
        })
      })
    return matchResult
  }
}
