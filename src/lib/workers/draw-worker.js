let effectMap

const painter = async (message) => {
  if (!effectMap) {
    const map = import('@/wasm').then((m) => m.default)
    console.log('loading wasm')
    effectMap = await map
  }

  const { wasmMemory } = effectMap

  try {
    const {
      pixelData,
      sourceHeight,
      sourceWidth,
      quality,
      bgColor,
      fgColor,
      activeEffect,
      readOffset = 0
      // gradient = 'rainbow'
    } = message.data

    // calculate input image size and ready pixel data from shared buffer
    const length = sourceHeight * sourceWidth * 4
    const data = new Uint8ClampedArray(length)
    for (let i = 0; i < length; i++) {
      data[i] = pixelData[readOffset + i]
    }

    const effectFn = await effectMap[activeEffect]

    // apply effect and get new image data
    const { width, height, data_offset, data_size } = effectFn(
      data,
      sourceWidth,
      sourceHeight,
      quality,
      bgColor,
      fgColor
    )

    // read new image from wasm buffer
    // and write pixel data to shared buffer
    const textureRaw = new Uint8ClampedArray(
      wasmMemory().buffer,
      data_offset,
      data_size
    )

    for (let i = 0; i < data_size; i++) {
      // Atomics.store(pixelData, i, textureRaw[i])
      pixelData[i + readOffset] = textureRaw[i]
    }

    // post back to main thread
    self.postMessage({
      err: false,
      width,
      height,
      data_offset,
      data_size
    })
  } catch (e) {
    console.error('Error in worker:', e)
    self.postMessage({ err: true })
  }
}

self.addEventListener('message', painter, false)
