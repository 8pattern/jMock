import express from 'express'
import bodyParser from 'body-parser'
import Mock from 'mockjs'
import { isNull } from 'util'

import MockCollection from '../mockCollection'
import { colorConsole, ConsoleColor, ConsoleBgColor, dateformat } from '../util'

export default function HttpRouter(mockCollection: MockCollection) {
  const router = express.Router()

  router.use(bodyParser.json())

  router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, X-File-Type, Cache-Control, Origin')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    next()
  })

  router.all('*', (req, res) => {
    const { url: originUrl, method } = req
    const url = originUrl.replace(/\?.*$/g, '')

    const currentTime = dateformat(new Date())
    const requestParam = method === 'GET' ? req.query : req.body

    function sendTrigger(msg: string | object): void {
      const content = Mock.mock(msg)
      console.log(`
      -----------------------${currentTime}---------------------------
      ${colorConsole('   HTTP   ', ConsoleColor.black, ConsoleBgColor.white)} ${colorConsole(method, ConsoleColor.yellow)} ${colorConsole(url, ConsoleColor.deepGreen)}
      
      ${colorConsole(' Request  ', ConsoleColor.black, ConsoleBgColor.blue)} ${JSON.stringify(requestParam)}
      
      ${colorConsole(' Response ', ConsoleColor.black, ConsoleBgColor.deepGreen)} ${content instanceof Object ? JSON.stringify(content) : content}
      -------------------------------------------------------------------------
      `)
      res.send(content)
    }

    const mockPattern = mockCollection.get(url, method)

    if (isNull(mockPattern)) {
      sendTrigger(`${method} ${url} donesn't have the mock data defination (${currentTime})`)
    } else {
      if (mockPattern instanceof Function) {
        mockPattern(sendTrigger, requestParam)
      } else {
        sendTrigger(mockPattern)
      }
    }
  })

  return router
}
