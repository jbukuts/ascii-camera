function sumColorList(pixelList) {
  const listLength = pixelList.length
  let finalColor = [0, 0, 0]

  pixelList.foEach((pixel) => {
    const [r, g, b] = pixel

    finalColor[0] += r
    finalColor[1] += g
    finalColor[2] += b
  })

  return finalColor.map((v) => v / listLength)
}

function calcBin(value) {
  return Math.min(Math.floor(value / 85), 2)
}

/**
 *
 * @param {Object} options
 * @param {number[][]} options.imageData
 * @returns
 */
function generatePalette(options) {
  const { imageData } = options

  // generate empty bins to represent 3x3x3 color space
  const bins = new Array(27).fill([])

  // dter
  imageData.forEach((pixel) => {
    const [r, g, b] = pixel
    const rAxis = calcBin(r) * 9
    const gAxis = calcBin(g) * 3
    const bAxis = calcBin(b)

    const binIndex = rAxis + gAxis + bAxis
    bins[binIndex].push(pixel)
  })

  // sort bins to find most prevalent colors
  bins.sort((a, b) => a.length > b.length)

  // each bin is averaged into a single color
  return bins.map((list) => sumColorList(list))
}

export default generatePalette
