import {
  createAsciiImage,
  createBadDitherImage,
  createDitherImage,
  wasmMemory
} from '@/wasm'

const wasmEffects = {
  ascii: createAsciiImage,
  bin_dither: createDitherImage,
  glitch_dither: createBadDitherImage
}

self.addEventListener('message', async (message) => {
  try {
    const {
      pixelData,
      sourceHeight,
      sourceWidth,
      quality,
      bgColor,
      fgColor,
      activeEffect
    } = message.data

    // calculate input image size and ready pixel data from shared buffer
    const length = sourceHeight * sourceWidth * 4
    const data = new Uint8ClampedArray(length)
    for (let i = 0; i < length; i++) {
      data[i] = pixelData[i]
    }

    // apply effect and get new image data
    const { width, height, data_offset, data_size } = wasmEffects[activeEffect](
      data,
      sourceWidth,
      sourceHeight,
      quality,
      bgColor,
      fgColor
    )

    // console.log(wasmMemory().buffer)
    // read new image from wasm buffer
    // and write pixel data to shared buffer
    const textureRaw = new Uint8ClampedArray(
      wasmMemory().buffer,
      data_offset,
      data_size
    )

    for (let i = 0; i < data_size; i++) {
      // Atomics.store(pixelData, i, textureRaw[i])
      pixelData[i] = textureRaw[i]
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
})
