import color from 'tinycolor2'

function hash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function hue(str: string) {
  const n = hash(str)
  return n % 360
}

export function generateGradient(username: string) {
  const h = hue(username)
  const c1 = color({ h, s: 0.95, l: 0.5 })
  const second = c1.triad()[1].toHexString()

  return {
    fromColor: c1.toHexString(),
    toColor: second,
  }
}
