export enum ConsoleColor {
  none = 0,
  black = 30,
  red = 31,
  green = 32,
  yellow = 33,
  blue = 34,
  purple = 35,
  deepGreen = 36,
  white = 37,
}

export enum ConsoleBgColor {
  none = 0,
  black = 40,
  red = 41,
  green = 42,
  yellow = 43,
  blue = 44,
  purple = 45,
  deepGreen = 46,
  white = 47,
}

export function colorConsole(content: string = '', color: ConsoleColor = ConsoleColor.none, bgColor: ConsoleBgColor = ConsoleBgColor.none) {
  if (bgColor === ConsoleBgColor.none) {
    if (color === ConsoleColor.none) {
      return content
    }
    return `\x1b[${color}m${content}\x1b[0m`
  }
  return `\x1b[${bgColor};${color}m${content}\x1b[0m`
}

export function dateformat(date: Date | number = Date.now(), formatStr: string = 'yyyy-mm-dd HH:MM:ss.l'): string {
  const tDate = (typeof date === 'number') ? new Date(date) : date
  let result = formatStr
  const o = {
    'y+': () => tDate.getFullYear(),
    'm+': () => (tDate.getMonth() + 1), 
    'd+': () => tDate.getDate(),
    'H+': () => tDate.getHours(),
    'M+': () => tDate.getMinutes(),
    's+': () => tDate.getSeconds(),
    'l': () => tDate.getMilliseconds(),
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      const v = o[k]()
      result = result.replace(RegExp.$1, ('' + v).padStart(RegExp.$1.length, '0'))
    }
  }
  return result
}

export function getFunctionArguments(fn: Function): string[] {
  const fnCode = fn.toString()
  return (fnCode.match(/\((.*)\)/) || ['', ''])[1].split(',').map(arg => arg.trim())
}
