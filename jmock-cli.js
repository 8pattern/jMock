#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

const JMock = require('./dist/jmock')

let port = 3000
let filePath = null
const jCommand = require('@8pattern/jcommand')

jCommand
  .fuzzy(['p', 'port'], (cmd) => {
    port = cmd.value || port
  })
  .fuzzy(['f', 'file'], (cmd) => {
    filePath = cmd.value || filePath
  })

let data = {}
if (filePath) {
  try {
    data = require(path.resolve(filePath))
    const jmock = new JMock(data)
    jmock.start(port)

    fs.watch(filePath, {}, () => {
      try {
        Reflect.deleteProperty(require.cache, require.resolve(filePath)) // delete the cached module
        data = require(path.resolve(filePath))
        jmock.update(data)
        console.log('mock data updated from ' + filePath)
      } catch (e) {
        console.error('Something error occurs when updating data file: \n' + e)
      }
    })
  } catch(e) {
    console.error('Something error occurs when loading data file: \n' + e)
  }
}

