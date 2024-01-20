<script setup>
import { onMounted, ref, watch } from 'vue'
import { fakeCanvas, fakeContext } from '@/constants'
import { useWorkerArr } from '@/lib/hooks'
import { store } from '@/store'
import { effectList } from '@/wasm'

const props = defineProps({
  sourceWidth: { type: Number, required: true },
  sourceHeight: { type: Number, required: true }
})

const sourceWidth = parseInt(props.sourceWidth || fakeCanvas.width)
const sourceHeight = parseInt(props.sourceHeight || fakeCanvas.height)
// const bufferLength = 1440 * 2560 * 4
const bufferLength =
  store.resolution[0] * store.resolution[1] * 4 * effectList.length
const offset = bufferLength / effectList.length
const vidEl = document.getElementsByTagName('video')[0]

const canvasRefs = ref([])
const { postToIndex, dataArr, sharedArr } = useWorkerArr(effectList.length)

const callWorker = (index) => {
  // get orig image
  const { data: pixelData } = fakeContext.getImageData(
    0,
    0,
    sourceWidth,
    sourceHeight
  )

  // write pixel data of src to shared array
  const os = index * offset
  for (let i = 0; i < pixelData.length; i++) {
    sharedArr[i + os] = pixelData[i]
  }

  postToIndex(index, {
    readOffset: os,
    pixelData: sharedArr,
    sourceHeight,
    sourceWidth,
    quality: 16,
    bgColor: Array.from(store.bgColor),
    fgColor: Array.from(store.fgColor),
    activeEffect: effectList[index]
  })
}

const handleMessage = (message, i) => {
  const { height, width, err, data_size } = message

  try {
    if (err) throw new Error(err)
    const canvas = Array.from(canvasRefs.value)[i]

    canvas.width = width
    canvas.height = height
    const finalContext = canvas.getContext('2d')

    // get image data from the shared array
    // since it was mutated by the worker
    const os = i * offset
    const arr = new Uint8ClampedArray(data_size)
    for (let v = 0; v < data_size; v++) {
      arr[v] = sharedArr[v + os]
    }

    const imageData = new ImageData(arr, width, height)

    // draw new image to final canvas
    // finalContext.clearRect(0, 0, width, height)
    finalContext.putImageData(imageData, 0, 0)
  } catch (e) {
    console.error('Error handling response from worker', e)
  }

  vidEl?.requestVideoFrameCallback(() => callWorker(i))
}

for (let i = 0; i < effectList.length; i++) {
  watch(
    () => dataArr[i].value,
    (message) => handleMessage(message, i),
    { deep: true }
  )
}

const selectEffect = (eff) => {
  store.activeEffect = eff
  store.showEffects = false
}

onMounted(() => {
  console.log(vidEl)
  vidEl?.requestVideoFrameCallback(() => {
    effectList.forEach((_, i) => callWorker(i))
  })
})
</script>

<template>
  <div id="all-effects-wrapper">
    <div
      v-for="effect in effectList"
      :key="effect"
      class="effect-view"
      @click="() => selectEffect(effect)">
      <canvas ref="canvasRefs"></canvas>
      <p>{{ effect }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
#all-effects-wrapper {
  width: 100%;
  height: calc(100% - 6px);
  position: absolute;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
}

.effect-view {
  position: relative;

  justify-self: stretch;
  align-self: stretch;
  overflow: hidden;
  z-index: 3;

  & p {
    padding: 0.5rem;
    color: white;
    font-size: min(1.5rem, 3vw);
    font-weight: bold;
    position: absolute;
    top: 0;
    left: 0;
  }

  &:hover {
    border: 4px solid white;
    cursor: pointer;
  }

  & canvas {
    // aspect-ratio: 4 / 3;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
}
</style>
