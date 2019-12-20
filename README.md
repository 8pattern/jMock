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
	[Path]: {
		[Method1]: [MockItem1],
		[Method2]: [MockItem2],
	},
	[Path2]: { ... }
}
```

For example:

```javascript
{
	'/mock/item/:productName': {
		GET: '@name',
		POST: function(cb, req, param) {
			if (req.id) {
				cb({ id: req.id, name: param.productName })
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

+ **Path** &lt;string&gt;
  
	1. It can receive an exact, fuzzy or regular expression pattern to match the request url.
		+ **Exact**: the url must match the whole pattern, e.g., "/a/b"
		+ **Fuzzy**: support ":&lt;name&gt;" or "*" to match the url.
		> + :&lt;name&gt;： match only a sub route, i.e. "/:url" can match "/a", but can **NOT** match "/a/b"
		> + *:  match any routes, i.e., "/route/\*" can match "/route/1" and "/route/1/2", but can **NOT** match "/1/2"
		+ **Reg**: use regular expressions as the pattern, i.e., "/(.*?)/(?&lt;id>.&gt;?)" 
		> + Be aware **NOT** define it as RegExp directly, i.e., use *'a/b/.\*'* rather than */a/b/.\*/*. (Because object can't receive RegExp as a key.)

	2. The matched string can be found from the third argument of function.
		```javascript
		// URL: /a/b
		// PATTERN: "/:r1/*" or "/(?<r1>.*)/(.*)"
		(cb, req, param) => {
			console.log(
				param[0], // "a"
				param[1], // "b"
				param.r1, // "a"
			)
		} 
		```

	3. priority: **Exact** > **Fuzzy** > **Reg**
  
  
+ **Method**&lt;string&gt;

	1. **All HTTP methods** supported by [Express.js](http://expressjs.com/) also **SUPPORTED** by us.

	2. Particularly, **WS** will be used to present the websocket method.

      

 + **MockItem**: &lt;string&gt; | &lt;object&gt; | &lt;array&gt; | &lt;function&gt;

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

      + argument: callback&lt;function&gt;, reqParams&lt;object&gt; routeParams&lt;object&gt;
      + return：<void>

	```javascript
		function(cb, req, param) {
			if(req.id === 0) {
				cb('success')
			} else if (param.name) {
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

Two arguments should be defined:
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



> **ENJOY YOUR MOCK DATA NOW!**
