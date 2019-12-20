import express, { Express } from 'express'
import expressWs from 'express-ws'

import MockCollection, { MockData, ValidMockParam } from './mockCollection'
import HttpMockRouter from './httpMock'
import WsMockRouter from './websocketMock'
import { colorConsole, ConsoleColor, ConsoleBgColor, dateformat } from './util'

const DEFAULT_PORT = 3000

export default class JMockServer {
  private app: Express
  readonly data: MockCollection

  constructor(mockData: MockData = {}) {
    const mockCollection = new MockCollection()
    mockCollection.load(mockData)

    this.data = mockCollection
    this.app = express()
    this.init()
  }

  private init() {
    const { app, data } = this

    // ----ws-------
    // this code MUST set before http, they will be blocked by get requests otherwise 
    expressWs(app)
    app.use('', WsMockRouter(data))

    // ----http-----
    app.use('', HttpMockRouter(data))
  }

  start(port: number = DEFAULT_PORT) {
    this.app.listen(port, () => {
      console.log(`
      -----------------------${dateformat(new Date())}---------------------------
      ${colorConsole('  Start  ', ConsoleColor.black, ConsoleBgColor.white)} ${colorConsole('Listening on port', ConsoleColor.yellow)} ${colorConsole(`${port}`, ConsoleColor.deepGreen)}
      -------------------------------------------------------------------------
      `)
    })
  }

  update(mockData: MockData = {}) {
    this.data.load(mockData)
  }

  append(path: string, method: string, content: ValidMockParam) {
    if (content) {
      this.data.set(path, method, content)
    }
  }

  delete(path: string, method: string): boolean {
    return this.data.delete(path, method)
  }
}
