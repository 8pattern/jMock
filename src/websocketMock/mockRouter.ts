import express from 'express'
import expressWs from 'express-ws'
import Mock from 'mockjs'
import { isNull } from 'util'

import MockCollection from '../mockCollection'
import { colorConsole, ConsoleColor, ConsoleBgColor, dateformat, getFunctionArguments } from '../util'

export default function WebsocketRouter(mockCollection: MockCollection) {
  const router = express.Router()
  expressWs(router as expressWs.Application)

  router.ws('*',  (ws, req) => {
    const { url: originalUrl } = req
    const url = originalUrl.replace('/.websocket', '')
    const method = 'WS'
    const currentTime = dateformat(new Date())

    ws.addEventListener('message', (msg) => {
      console.log(`
      -----------------------${currentTime}---------------------------
      ${colorConsole('Websocket', ConsoleColor.black, ConsoleBgColor.white)} ${colorConsole(method, ConsoleColor.yellow)} ${colorConsole(url, ConsoleColor.deepGreen)}
      
      ${colorConsole(' Receive ', ConsoleColor.black, ConsoleBgColor.blue)} ${msg.data}
      -------------------------------------------------------------------------
      `)
    })

    function sendTrigger(msg: string | object, routeParam: object | null = null): void {
      const content = Mock.mock(msg)
      ws.send(content)
      console.log(`
      -----------------------${dateformat(new Date())}---------------------------
      ${colorConsole('Websocket', ConsoleColor.black, ConsoleBgColor.white)} ${colorConsole(method, ConsoleColor.yellow)} ${colorConsole(url, ConsoleColor.deepGreen)}
      
      ${colorConsole('  Send   ', ConsoleColor.black, ConsoleBgColor.deepGreen)} ${content instanceof Object ? JSON.stringify(content) : content}
      -------------------------------------------------------------------------
      `)
    }

    const mockData = mockCollection.get(url, method)
    if (isNull(mockData)) {
      sendTrigger(`${method} ${url} donesn't have the mock data defination (${currentTime})`)
    } else {
      const [mockContent, routeParam] = mockData
      if (mockContent instanceof Function) {
        mockContent(sendTrigger)
        ws.addEventListener('message', (e) => {
          if (getFunctionArguments(mockContent).length > 1) {
            mockContent(sendTrigger, e.data, routeParam)
          }
        })
      } else {
        sendTrigger(mockContent)
      }
    }

    const t = setInterval(() => {
      const random = Math.random()
      ws.send(JSON.stringify({
        state: random < 0.3 ? 0 : 1,
        score: random,
      }))
    }, 500)

    ws.addEventListener('close', () => {
      clearInterval(t)
    })
  })

  return router
}

