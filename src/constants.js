const fakeCanvas = document.createElement('canvas')
const fakeContext = fakeCanvas.getContext('2d', { willReadFrequently: true })

const colors = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255]
}

const qualities = {
  very_low: 12,
  low: 10,
  medium: 8,
  high: 6,
  very_high: 4
}

const supportedResolutions = {
  cga: [320, 200],
  vga: [640, 480],
  hd: [1280, 720],
  fhd: [1920, 1080],
  box: [500, 500]
}

const reverseKeyVal = (obj) => {
  return Object.keys(obj).reduce((acc, curr) => {
    const newKey = obj[curr].toString()
    acc[newKey] = curr
    return acc
  }, {})
}

const reverseQualities = reverseKeyVal(qualities)
const reverseSupportedResolutions = reverseKeyVal(supportedResolutions)
const reverseColors = reverseKeyVal(colors)

const defaults = {
  fg: 'white',
  bg: 'black',
  resolution: 'vga',
  quality: 'medium',
  effect: 'heat_map'
}

export {
  colors,
  reverseColors,
  qualities,
  reverseQualities,
  supportedResolutions,
  reverseSupportedResolutions,
  defaults,
  fakeCanvas,
  fakeContext
}
