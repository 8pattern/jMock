export function getLegalMethod(method: string): string {
  return method.toUpperCase()
}

export interface MatchParam extends Array<string> {
  [name: string]: any
}
interface MatchResult {
  isMatch: boolean,
  param: MatchParam,
}

export function exactMatchRoute(route: string, pattern: string): MatchResult {
  return {
    isMatch: route === pattern,
    param: [],
  }
}

export function regMatchRoute(route: string, pattern: string): MatchResult {
  try {
    const re = new RegExp(`^${pattern}$`)
    const result = route.match(re)
    if (result) {
      // unnamed groups
      const param = result.slice(1)
      // named groups
      const { groups } = result
      if (groups) {
        Object.keys(groups).forEach(key => {
          param[key] = groups[key]
        })
      }
  
      return {
        isMatch: true,
        param,
      }
    }
  
    return {
      isMatch: false,
      param: [],
    }
  } catch(e) {
    return {
      isMatch: false,
      param: [],
    }
  }
}

export function convertFuzzyToRegexpString(fuzzyPattern: string): string {
  return `/${fuzzyPattern}/`
    .replace(/(?<!\/)([\.\*])(?!\/)/g, '\$1') // 't.ttt*tt' -> 't\.ttt\*tt'
    .replace(/(?<=\/)\*(?=\/)/g, '(.*?)') // '/*/t' -> '/(.*)/t'
    .replace(/(?<=\/)\*$/g, '(.*?)') // '/t/*' -> '/t/(.*)'
    .replace(/(?<=\/):(.+?)(?=\/)/g, '(?<$1>[^\/]*?)') // '/:id/t' -> '/(?<id>[^\/]*)/t'
    .replace(/(?<=\/):(.+?)$/g, '(?<$1>[^\/]*?)') // '/t/:id' -> '/t/(?<id>[^\/]*)'
    .slice(1, -1)
}

export function fuzzyMatchRoute(route: string, pattern: string): MatchResult {
  return regMatchRoute(route, convertFuzzyToRegexpString(pattern))
}
