#!/usr/bin/env node

const JMock = require('./dist/jmock')

const args = {}
process.argv.slice(2).forEach((arg) => {
  if (/--?(.+)=(.+)/.test(arg)) {
    args[RegExp.$1] = RegExp.$2
  }
})

let port = args.port || args.p || 3000

let filePath = args.file || args.f
let data = {}
if (filePath) {
  try {
    const fileData = require('fs').readFileSync(require('path').resolve(filePath)).toString()
    if (/(\{[\s\S]*\})/.test(fileData)) {
      eval(`data = ${RegExp.$1}`)
    } else {
      throw new Error('The file seems not to define the mock content.')
    }
  } catch(e) {
    console.error('Something error occurs when loading data file: \n' + e)
  }
}

const jmock = new JMock(data)
jmock.start(port)
