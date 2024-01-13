/* eslint-disable no-unused-vars */
const fakeCanvas = document.createElement('canvas')
const fakeContext = fakeCanvas.getContext('2d', { willReadFrequently: true })
import { store } from '@/store'

/**
 * Function that will source image from video element and paint to canvas element
 *
 * @param {import('vue').Ref<any>} videoRef source video stream to grab image
 * @param {import('vue').Ref<any>} finalCanvasRef destination canvas to paint to
 * @returns {Promise<number>} time to complete drawing frame (ms)
 */
export async function paintImage(videoRef, finalCanvasRef) {
  try {
    const video = videoRef.value
    const finalCanvas = finalCanvasRef.value
    const finalContext = finalCanvas.getContext('2d')

    fakeCanvas.width = video.clientWidth
    fakeCanvas.height = video.clientHeight
    fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height)
    const { data: pixelData } = fakeContext.getImageData(
      0,
      0,
      fakeCanvas.width,
      fakeCanvas.height
    )

    var startTime = performance.now()

    const { width, height, data_offset, data_size } = store.wasmEffects[
      store.activeEffect
    ](
      pixelData,
      fakeCanvas.width,
      fakeCanvas.height,
      store.quality,
      store.bgColor,
      store.fgColor
    )
    var endTime = performance.now()
    finalCanvas.width = width
    finalCanvas.height = height

    const memory = store.wasmMem()
    const textureRaw = new Uint8ClampedArray(
      memory.buffer,
      data_offset,
      data_size
    )
    const imageData = new ImageData(textureRaw, width, height)
    finalContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height)
    finalContext.putImageData(imageData, 0, 0)

    const finalTime = (endTime - startTime).toFixed(2)
    return finalTime
  } catch (e) {
    console.error(`Problem drawing frame:`, e)
    return 0
  }
}
