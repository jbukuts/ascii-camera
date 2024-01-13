<script setup>
import { onActivated, ref, watch, watchEffect } from 'vue'
import { fakeCanvas } from '@/constants'
import { useCamera, useVideo, useWorker } from '@/lib/hooks'
import { store } from '@/store'

const fakeContext = fakeCanvas.getContext('2d', { willReadFrequently: true })

const videoRef = useVideo()
const finalCanvasRef = ref()
const { activeCamera, state } = useCamera()
const { data, post, sharedArr, sharedBuffer } = useWorker()
const startTime = ref(0)
const endTime = ref(1)
const renderError = ref(false)

const postToWorker = () => {
  try {
    // get source image dimensions
    const sourceWidth = videoRef.value?.videoWidth || 0
    const sourceHeight = videoRef.value?.videoHeight || 0

    if (!videoRef.value || sourceHeight === 0 || sourceWidth === 0) return

    startTime.value = performance.now()

    if (!store.pauseStream) {
      // draw source image to intermediate canvas
      fakeCanvas.width = sourceWidth
      fakeCanvas.height = sourceHeight
      fakeContext.drawImage(videoRef.value, 0, 0, sourceWidth, sourceHeight)
    }
    const { data: pixelData } = fakeContext.getImageData(
      0,
      0,
      sourceWidth,
      sourceHeight
    )

    // write pixel data of src to shared array
    for (let i = 0; i < pixelData.length; i++) {
      sharedArr[i] = pixelData[i]
    }
    // pixelData.forEach((v, i) => (sharedArr[i] = v))

    post({
      pixelData: sharedArr,
      sourceHeight,
      sourceWidth,
      quality: store.quality,
      bgColor: Array.from(store.bgColor),
      fgColor: Array.from(store.fgColor),
      activeEffect: store.activeEffect
    })
  } catch (e) {
    console.error('Error sending to worker:', e)
  }
}

const handleStreamChanges = async () => {
  const videoEl = videoRef.value
  if (!videoEl || !activeCamera.value?.camera) return
  console.log('cameratime', activeCamera.value.camera.label)
  await activeCamera.value?.activate(videoEl, { resolution: store.resolution })
}

// handle received messages from the worker
watch(data, (message) => {
  const { height, width, err, data_size } = message

  try {
    if (err) throw new Error(err)

    if (!videoRef.value || !finalCanvasRef.value) {
      console.log('no video ref')
      return
    }

    finalCanvasRef.value.width = width
    finalCanvasRef.value.height = height
    const finalContext = finalCanvasRef.value.getContext('2d')

    // get image data from the shared array
    // since it was mutated by the worker
    const arr = new Uint8ClampedArray(sharedBuffer, 0, data_size).slice()
    const imageData = new ImageData(arr, width, height)

    // draw new image to final canvas
    // finalContext.clearRect(0, 0, width, height)
    finalContext.putImageData(imageData, 0, 0)

    // go around again
    endTime.value = performance.now() - startTime.value
    renderError.value = false
  } catch (e) {
    renderError.value = true
    console.error('Error handling response from worker', e)
  }

  videoRef.value.requestVideoFrameCallback(postToWorker)
})

// handle changes to resolution and camera
watchEffect(handleStreamChanges, { flush: 'post' })

onActivated(() => {
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    console.log('start render loop', videoRef.value)
    handleStreamChanges().then(() => {
      videoRef.value.requestVideoFrameCallback(postToWorker)
    })
  }
})
</script>

<template>
  <div id="camera-view-container">
    <div class="render-state" v-if="renderError">
      <p>Error during render. Trying changing settings,</p>
    </div>
    <div class="render-state" v-if="state === 'error'">
      <p>Error connecting camera. Try changing camera or reloading.</p>
    </div>
    <div class="render-state" v-if="state === 'loading'"><p>Loading...</p></div>
    <video
      ref="videoRef"
      id="video-src"
      :class="!store.showOrig ? 'hide' : ''"
      playsinline
      autoplay
      muted></video>
    <canvas ref="finalCanvasRef" id="drawn-picture"></canvas>
    <p id="render-time" v-if="store.debugMode">
      {{ (1000 / endTime).toFixed(2) }} fps<br />
      {{ endTime.toFixed(2) }} ms
    </p>
  </div>
</template>

<style scoped lang="scss">
.render-state {
  position: absolute;
  background-color: white;
  color: black;
  height: fit-content;
  width: fit-content;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 2rem;
  padding: 0.375rem;
  font-weight: bolder;
  border: thick double black;
}

#camera-view-container {
  width: 100%;
  position: relative;
}

#video-src {
  pointer-events: none;
  position: absolute;
  left: 0px;
  width: 100%;
  filter: grayscale(1);
}

.hide {
  visibility: hidden;
}

#render-time {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.15rem;
  background-color: black;
  color: white;
  font-size: x-small;
}

#drawn-picture {
  width: 100%;
  border-bottom: 3px solid black;
}
</style>
