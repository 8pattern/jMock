import { isNull } from "util"

interface MockCallbackFunction {
  (msg: string): void
}

interface MockContentFunction {
  (callback: MockCallbackFunction, ...args: unknown[]): void
}

export type AvailableMockParameter = object | string | MockContentFunction

interface MockContent {
  [method: string]: AvailableMockParameter
}

export interface MockData {
  [url: string]: MockContent
}

export default class MockCollection {
  private data: MockData = {}

  constructor(mockData: MockData = {}) {
    this.load(mockData)
  }

  private static getLegalUrl(url: string): string {
    return ('/' + url).replace(/^\/+/, '/')
  }

  private static getLegalMethod(method: string): string {
    return method.toUpperCase()
  }

  load(mockData: MockData = {}) {
    const legalData = {}
    Object.keys(mockData)
      .forEach((url) => {
        const legalUrl = MockCollection.getLegalUrl(url)
        const mockContent = mockData[url]
        Object.keys(mockContent)
          .forEach((method) => {
            const legalMethod = MockCollection.getLegalMethod(method)
            legalData[legalUrl][legalMethod] = mockContent[method]
          })
      })
    this.data = mockData
  }

  set(url: string, method: string, content: AvailableMockParameter): void {
    const legalUrl = MockCollection.getLegalUrl(url)
    const legalMethod = MockCollection.getLegalMethod(method)
    this.data[legalUrl][legalMethod] = content
  }

  delete(url: string, method: string): boolean {
    const legalUrl = MockCollection.getLegalUrl(url)
    const legalMethod = MockCollection.getLegalMethod(method)
    if (this.data[legalUrl]) {
      if (this.data[legalUrl][legalMethod]) {
        Reflect.deleteProperty(this.data[legalUrl], legalMethod)
        return true
      }
    }
    return false
  }

  get(url: string, method: string): AvailableMockParameter | null {
    return this.exactMatch(url, method) || this.regMatch(url, method)
  }

  exactMatch(url: string, method: string): AvailableMockParameter | null {
    const legalUrl = MockCollection.getLegalUrl(url)
    const legalMethod = MockCollection.getLegalMethod(method)
    const urlContent = this.data[legalUrl]
    if (!urlContent) {
      return null
    }
    return urlContent[legalMethod] || null
  }

  regMatch(url: string, method: string): AvailableMockParameter | null {
    const matchedUrl = Object.keys(this.data).find(urlPattern => (new RegExp(`^${urlPattern}$`)).test(url)) || null
    return isNull(matchedUrl) ? null : this.exactMatch(matchedUrl, method)
  }
}
