<script setup>
import { ref, watch } from 'vue'
import { useWorker } from '@/lib/hooks'
const DEF_SIZE = 3180 * 2160 * 4

const imageCanvas = document.createElement('canvas')
const imageContext = imageCanvas.getContext('2d', { willReadFrequently: true })

// eslint-disable-next-line no-undef
const sharedBuffer = ref(new SharedArrayBuffer(DEF_SIZE))
const sharedArr = ref(new Uint8Array(sharedBuffer.value))
const refInput = ref(null)
const outputImage = ref(null)
const contentDimensions = ref([0, 0])
const processing = ref(false)

const { post, data } = useWorker()

const readImage = (src) => {
  const fr = new FileReader()
  return new Promise((res) => {
    fr.onload = () => {
      res(fr.result)
    }
    fr.readAsDataURL(src)
  })
}

const processImage = async () => {
  const input = refInput.value

  if (!input) return

  const uploadImage = input.files[0]
  const imgSrc = await readImage(uploadImage)

  const img = new Image()

  img.onload = () => {
    const { width, height } = img

    // eslint-disable-next-line no-undef
    sharedBuffer.value = new SharedArrayBuffer(width * height * 4)
    sharedArr.value = new Uint8Array(sharedBuffer.value)

    imageCanvas.width = width
    imageCanvas.height = height
    imageContext.drawImage(img, 0, 0)
    const { data: pixelData } = imageContext.getImageData(0, 0, width, height)

    for (let i = 0; i < pixelData.length; i++) {
      sharedArr.value[i] = pixelData[i]
    }

    processing.value = true

    post({
      pixelData: sharedArr.value,
      sourceHeight: height,
      sourceWidth: width,
      quality: 8,
      bgColor: Array.from([0, 0, 0]),
      fgColor: Array.from([255, 255, 255]),
      activeEffect: 'heat_map'
    })
  }

  img.src = imgSrc
}

watch(data, (message) => {
  const { height, width, err, data_size } = message

  try {
    if (err) throw new Error(err)

    imageCanvas.width = width
    imageCanvas.height = height

    // get image data from the shared array
    const arr = new Uint8ClampedArray(sharedBuffer.value, 0, data_size).slice()
    const imageData = new ImageData(arr, width, height)
    contentDimensions.value = [width, height]

    imageContext.putImageData(imageData, 0, 0)

    // draw new image to final canvas
    outputImage.value = imageCanvas.toDataURL()
  } catch (e) {
    console.error('Error handling response from worker', e)
  }

  processing.value = false
})
</script>

<template>
  <div id="upload-wrapper">
    <div v-if="outputImage == null">
      <p>Select an image to apply an effect to</p>
    </div>
    <img id="output-image" v-else :src="outputImage" />
    <label id="file-upload">
      <input
        :disabled="processing"
        ref="refInput"
        accept="image/*"
        type="file"
        @change="processImage" />
      choose_image
    </label>
  </div>
</template>

<style scoped lang="scss">
#upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1.5rem;
}

#file-upload {
  color: black;
  border: 1px solid black;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  margin: 1rem;
  transition: 0.1s ease-in-out;
  border-radius: 5px;

  & > input[type='file'] {
    display: none;
  }

  &:disabled {
    background-color: red;
  }

  &:hover {
    color: white;
    background: black;
  }
}

#output-image {
  max-width: 100%;
  max-height: 700px;
}
</style>
