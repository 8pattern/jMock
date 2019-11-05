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
    data = require(require('path').resolve(filePath))
  } catch(e) {
    console.error('Something error occurs when loading data file: \n' + e)
  }
}

const jmock = new JMock(data)
jmock.start(port)
