<script setup>
import { onActivated, onDeactivated, ref, watch, watchEffect } from 'vue'
import { fakeCanvas, fakeContext } from '@/constants'
import { useCamera, useVideo, useWorker } from '@/lib/hooks'
import { store } from '@/store'
import AllEffects from './AllEffects.vue'
import CameraSettings from './CameraSettings.vue'

const videoRef = useVideo()
const finalCanvasRef = ref()
const { activeCamera, state: cameraState } = useCamera()
const { data, post, sharedArr, sharedBuffer } = useWorker()
const startTime = ref(0)
const endTime = ref(1)
const renderState = ref('loading')

// ghetto mutex
const mutex = ref(0)

const postToWorker = () => {
  try {
    if (mutex.value !== 0) {
      console.warn(
        'Tried to apply effect when worker is already running. Stopping'
      )
      return
    }

    if (store.screen !== 'camera') return

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

    if (store.showEffects) {
      videoRef.value?.requestVideoFrameCallback(postToWorker)
      return
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

    mutex.value += 1
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
  return await activeCamera.value?.activate(videoEl, {
    resolution: store.resolution
  })
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
    renderState.value = 'success'
    mutex.value -= 1
  } catch (e) {
    renderState.value = 'error'
    console.error('Error handling response from worker', e)
  }

  videoRef.value?.requestVideoFrameCallback(postToWorker)
})

// handle changes to resolution and camera
watchEffect(handleStreamChanges, { flush: 'post' })

onActivated(() => {
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    handleStreamChanges().then(() => {
      console.log('start render loop', videoRef.value.requestVideoFrameCallback)
      videoRef.value?.requestVideoFrameCallback(postToWorker)
    })
  }
})

onDeactivated(() => {
  renderState.value = 'loading'
  mutex.value = 0
})
</script>

<template>
  <div id="camera-view-container">
    <video
      ref="videoRef"
      id="video-src"
      :class="!store.showOrig ? 'hide' : ''"
      playsinline
      autoplay
      muted
      disable-picture-in-picture></video>
    <CameraSettings v-if="store.showSettings" />
    <AllEffects
      v-if="cameraState === 'success' && store.showEffects"
      :source-height="videoRef?.videoHeight || 0"
      :source-width="videoRef?.videoWidth || 0" />

    <div
      class="render-state"
      v-if="cameraState !== 'success' || renderState !== 'success'">
      <p v-if="cameraState === 'error' || renderState === 'error'">
        Error connecting camera. Try changing camera or reloading.
      </p>
      <p v-else-if="cameraState === 'loading' || renderState === 'loading'">
        Loading...
      </p>
    </div>

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
  z-index: 1;
  filter: grayscale(1);
}

.hide {
  visibility: hidden;
  color: transparent;
}

// causes issue on firefox
@-moz-document url-prefix() {
  .hide {
    visibility: visible;
    opacity: 0.00001;
  }
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
  // aspect-ratio: 4 / 3;
}
</style>
