# jMock 
A **mock server** for JS, support **HTTP** methods and **Websocket**



## Install

```javascript
npm install @8pattern/jmock
```



## Usage

### MockData Difination

The MockData is defined as following:

```javascript
{
	[PATH]: {
		[METHOD1]: [MockItem1],
		[METHOD2]: [MockItem2],
	},
	[PATH2]: { ... }
}
```

For example:

```javascript
{
	'/mock/item': {
		GET: '@name',
		POST: function(cb, req) {
			if (req.id) {
				cb({ id: req.id, name: '@name' })
			} else {
				cb({ desc: 'error' })
			}
		}
	},
	'/mock/item2/.*': {
		PUT: {
			'name|+1': number
		}
	},
	'/ws/mock': {
        WS: (cb, req) => {
            if (req.id) {
                cb('@name')
            }
        }
    }
}
```

+ **PATH** <string>
  
  1. It can receive an exact or fuzzy path to match the request url.
  
2. The usage of fuzzy path is same as RegExp, but you **CAN NOT** define it as RegExp, i.e., *'a/b/.\*'* rather than */a/b/.\*/*. (Because object can't receive RegExp directly as a key.)
  
  3. if the exact path and fuzzy path match a request simultanously, **the exact path will have the HIGHER priority**.
  
     
  
+ **MEHTOD**<string>

   1. **All HTTP methods** supported by [Express.js](http://expressjs.com/) also **SUPPORTED** by us.

   2. Particularly, **WS** will be used to present the websocket method.

      

 + **MockItem**: <string> | <object> | <array> | <function>

   1. string  / object / array

     ```javascript
     'hello world' | { hello: 'world' } | ['hello', 'world']
     ```

   Thanks to [mockjs](http://mockjs.com/), which provides a wonderful data generator, **ALL** its template strings will also work well in jMock. For example:

     ```javascript
     '@name' => "Sharon Walker"
     { "number|1-100": 100 } => { "number": 201 }
     ```

   2. function

      + argument: callback<function>, reqParams<object>
      + return：<void>

     ```javascript
       function(cb, req) {
           if(req.id === 0) {
               cb('success')
           } else {
               setTimeout(() => {
                   cb('fail')
               }, 200)
           }
       }
     ```

    The callback function also receive a MockItem (**except function**) as the only argument, so the grammer of  [mockjs](http://mockjs.com/) also works. For example:

     ```javascript
      (cb) => {
         cb({ name: '@name' })
      }
      // same as { name: '@name' }
     ```



### Run as CMD

1. firstly, you should prepare a mock data file, and export it by CommonJS. For example:

```javascript
module.exports = {
	'/mock/name': {
        'GET': '@name'
    }
}
```

2. then, code the command in the shell.

```shell
jmock [--file=./mockdata.js] [--port=3000]
```

​	Two arguments should be defined:

+ mock file: **--file** or **-f**

  1. e.g., --file=./mockdata.js.

  2. if not asign it, the mock data will be {} by default 

+ port: **--port** or **-p**

  1. e.g., --port=3001

  2. **3000** by default

     

### Run as Script

```javascript
const JMock = require('@8pattern/jmock')

const port = 3000
const mockData = {
	'/mock/name': {
        'GET': '@name'
    }
}

const jmock = new JMock(data)
jmock.start(port)
```



**ENJOY YOUR MOCK DATA NOW!**