import {
  getLegalMethod,
  exactMatchRoute,
  regMatchRoute,
  convertFuzzyToRegexpString,
  fuzzyMatchRoute,
} from '../util'

describe('getLegalMethod', () => {
  test('all lowercase characters will transform to uppercase', () => {
    expect(getLegalMethod('get')).toBe('GET')
    expect(getLegalMethod('Get')).toBe('GET')
    expect(getLegalMethod('GET')).toBe('GET')

    expect(getLegalMethod('post')).toBe('POST')
    expect(getLegalMethod('Post')).toBe('POST')
    expect(getLegalMethod('POst')).toBe('POST')
  })
})

describe('exactMatchRoute', () => {
  test('the route must strictly match', () => {
    expect(exactMatchRoute('/', '/').isMatch).toBeTruthy()
    expect(exactMatchRoute('/', '/a').isMatch).not.toBeTruthy()
    expect(exactMatchRoute('/', '').isMatch).not.toBeTruthy()

    expect(exactMatchRoute('/test', '/test').isMatch).toBeTruthy()
    expect(exactMatchRoute('/test', '/test/').isMatch).not.toBeTruthy()
  })
})

describe('regMatchRoute', () => {
  test('match the route according to RE rules', () => {
    expect(regMatchRoute('/', '.').isMatch).toBeTruthy()
    expect(regMatchRoute('/', '').isMatch).not.toBeTruthy()
    expect(regMatchRoute('/', '.+').isMatch).toBeTruthy()

    expect(regMatchRoute('/test/abc', '/.*').isMatch).toBeTruthy()
    expect(regMatchRoute('/test/abc', '/.*/.*').isMatch).toBeTruthy()
    expect(regMatchRoute('/test/abc', '/.*/.*/.*').isMatch).not.toBeTruthy()
  })

  test('the return params are correct', () => {
    expect(regMatchRoute('/', '.').param).toStrictEqual([])
    expect(regMatchRoute('/', '(.+)').param).toStrictEqual([ '/' ])
    expect(regMatchRoute('/', '()(.+)').param).toStrictEqual([ '', '/' ])

    expect(regMatchRoute('/test/abc', '/(.*)').param).toStrictEqual([ 'test/abc' ])
    expect(regMatchRoute('/test/abc', '/(.*)/(.*)').param).toStrictEqual([ 'test', 'abc' ])
    expect(regMatchRoute('/test/abc', '/([^/]*)/([^/]*)').param).toStrictEqual([ 'test', 'abc' ])

    expect(regMatchRoute('/test/abc', '/(?<route1>.*)/(?<route2>.*)').param.length).toBe(2)
    expect(regMatchRoute('/test/abc', '/(?<route1>.*)/(?<route2>.*)').param.route1).toContain('test')
    expect(regMatchRoute('/test/abc', '/(?<route1>.*)/(?<route2>.*)').param.route2).toContain('abc')
    
    
    expect(regMatchRoute('/test/abc', '/.*/.*/.*').param).toStrictEqual([])
  })
})

describe('convertFuzzyToRegexpString', () => {
  test('"*" in routes will convert to a wildcard with a unnamed capture group', () => {
    expect(convertFuzzyToRegexpString('/*')).toBe('/(.*?)')
    expect(convertFuzzyToRegexpString('/*/')).toBe('/(.*?)/')
    expect(convertFuzzyToRegexpString('*')).toBe('(.*?)')

    expect(convertFuzzyToRegexpString('/*/*')).toBe('/(.*?)/(.*?)')
    expect(convertFuzzyToRegexpString('*/*')).toBe('(.*?)/(.*?)')
    expect(convertFuzzyToRegexpString('/*/*/*/*/*')).toBe('/(.*?)/(.*?)/(.*?)/(.*?)/(.*?)')

    expect(convertFuzzyToRegexpString('/*/a/*')).toBe('/(.*?)/a/(.*?)')
    expect(convertFuzzyToRegexpString('/*/*/a')).toBe('/(.*?)/(.*?)/a')

    expect(convertFuzzyToRegexpString('**')).toBe('\*\*')
    expect(convertFuzzyToRegexpString('/.*')).toBe('/\.\*')
    expect(convertFuzzyToRegexpString('/*./')).toBe('/\*\./')
  })

  test('"*" not in routes will convert to a escape character', () => {
    expect(convertFuzzyToRegexpString('ab*cd')).toBe('ab\*cd')
    expect(convertFuzzyToRegexpString('ab/*cd')).toBe('ab/\*cd')
    expect(convertFuzzyToRegexpString('a/b*')).toBe('a/b\*')
  })

  test('":<str>" in routes will convert to a wildcard with a named capture group', () => {
    expect(convertFuzzyToRegexpString(':url')).toBe('(?<url>[^\/]*?)')
    expect(convertFuzzyToRegexpString('ab/:r')).toBe('ab/(?<r>[^\/]*?)')
    expect(convertFuzzyToRegexpString(':r/cd')).toBe('(?<r>[^\/]*?)/cd')
    expect(convertFuzzyToRegexpString('ab/:r1/:r2')).toBe('ab/(?<r1>[^\/]*?)/(?<r2>[^\/]*?)')
    expect(convertFuzzyToRegexpString('a/:r1/:r2/b')).toBe('a/(?<r1>[^\/]*?)/(?<r2>[^\/]*?)/b')
  })

  test('":<str>" not in routes won\' change', () => {
    expect(convertFuzzyToRegexpString('a:url')).toBe('a:url')
    expect(convertFuzzyToRegexpString('ab/c:r')).toBe('ab/c:r')
    expect(convertFuzzyToRegexpString('ab:r/cd')).toBe('ab:r/cd')
  })

  test('"." will convert to a escape character', () => {
    expect(convertFuzzyToRegexpString('ab.cd')).toBe('ab\.cd')
    expect(convertFuzzyToRegexpString('ab/*.cd')).toBe('ab/\*\.cd')
    expect(convertFuzzyToRegexpString('a/b.c')).toBe('a/b\.c')
  })
})

describe('fuzzyMatchRoute', () => {
  test('"*" in routes can match any route patterns', () => {
    expect(fuzzyMatchRoute('/', '*').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/abc', '*').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '*').isMatch).toBeTruthy()

    expect(fuzzyMatchRoute('/a/b/c', '/a/*').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/a/b/*').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/a/*/c').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/*/c').isMatch).toBeTruthy()

    expect(fuzzyMatchRoute('/a/b/c', '/*/a').isMatch).not.toBeTruthy()
  })

  test('"*" matched patterns can get from the array', () => {
    expect(fuzzyMatchRoute('/', '*').param).toStrictEqual(['/'])
    expect(fuzzyMatchRoute('/abc', '*').param).toStrictEqual(['/abc'])
    expect(fuzzyMatchRoute('/a/b/c', '*').param).toStrictEqual(['/a/b/c'])

    expect(fuzzyMatchRoute('/a/b/c', '/a/*').param).toStrictEqual(['b/c'])
    expect(fuzzyMatchRoute('/a/b/c', '/a/b/*').param).toStrictEqual(['c'])
    expect(fuzzyMatchRoute('/a/b/c', '/a/*/c').param).toStrictEqual(['b'])
    expect(fuzzyMatchRoute('/a/b/c', '/*/c').param).toStrictEqual(['a/b'])

    expect(fuzzyMatchRoute('/a/b/c', '/*/*/*').param).toStrictEqual(['a', 'b', 'c'])
    expect(fuzzyMatchRoute('/a/b/c', '/*/*').param).toStrictEqual(['a', 'b/c'])
  })

  test('":<str>" in routes can match any route patterns', () => {
    expect(fuzzyMatchRoute('/', '/:url').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/', ':url').isMatch).not.toBeTruthy()
    expect(fuzzyMatchRoute('/abc', '/:url').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/abc', ':url').isMatch).not.toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', ':url').isMatch).not.toBeTruthy()

    expect(fuzzyMatchRoute('/a/b/c', '/a/:url').isMatch).not.toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/a/b/:url').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/a/:url/c').isMatch).toBeTruthy()
    expect(fuzzyMatchRoute('/a/b/c', '/:url/c').isMatch).not.toBeTruthy()

    expect(fuzzyMatchRoute('/a/b/c', '/:url/a').isMatch).not.toBeTruthy()
  })

  test('":<str>" matched patterns can get from its name', () => {
    expect(fuzzyMatchRoute('/', '/:url').param.url).toBe('')
    expect(fuzzyMatchRoute('/abc', '/:url').param.url).toBe('abc')

    expect(fuzzyMatchRoute('/a/b/c', '/a/b/:url').param.url).toBe('c')
    expect(fuzzyMatchRoute('/a/b/c', '/a/:url/c').param.url).toBe('b')

    expect(fuzzyMatchRoute('/a/b', '/:r1/:r2').param.r1).toBe('a')
    expect(fuzzyMatchRoute('/a/b', '/:r1/:r2').param.r2).toBe('b')

    expect(fuzzyMatchRoute('/a/b/c', '/:r1/:r2/:r3').param.r3).toBe('c')
  })

  test('hybrid patterns', () => {
    expect(fuzzyMatchRoute('/a/b/c', '/*/:r2').param.length).toBe(2)
    expect(fuzzyMatchRoute('/a/b/c', '/*/:r2').param[0]).toBe('a/b')
    expect(fuzzyMatchRoute('/a/b/c', '/*/:r2').param[1]).toBe('c')
    expect(fuzzyMatchRoute('/a/b/c', '/*/:r2').param.r2).toBe('c')

    expect(fuzzyMatchRoute('/a/b/c', '/:r1/*').param.length).toBe(2)
    expect(fuzzyMatchRoute('/a/b/c', '/:r1/*').param[0]).toBe('a')
    expect(fuzzyMatchRoute('/a/b/c', '/:r1/*').param[1]).toBe('b/c')
    expect(fuzzyMatchRoute('/a/b/c', '/:r1/*').param.r1).toBe('a')
  })
})
