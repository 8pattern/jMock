#!/usr/bin/env node
const Path = require('path')
const fs = require('fs')
const JMock = require('./dist/jmock')

const args = {}
process.argv.slice(2).forEach((arg) => {
  if (/--(.+)=(.+)/.test(arg)) {
    args[RegExp.$1] = RegExp.$2
  }
})

let port = args.port || 3000

let data = {}
if ('data' in args) {
  try {
    data = JSON.parse(fs.readFileSync(Path.resolve(args.data)))
  } catch(e) {
    console.log('Something error occurs when loading data file: \n' + e)
  }
}

console.log(args, port, data, Path.resolve(args.data))

const jMock = new JMock(data)
jMock.start(port)
