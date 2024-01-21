import { onActivated, onDeactivated, ref } from 'vue'
import { activateStream, getCameraList, isCameraAvail } from './helpers'

const cameraList = ref([])
const activeCamera = ref(null)
const state = ref('loading')
// const supportedResolutions = ref([])

const activateCamera = async (videoEl, index, options) => {
  const cam = cameraList.value[index]
  return activateStream(videoEl, {
    activeCamera: cam.camera,
    ...options
  })
}

const handleCameras = async () => {
  getCameraList().then((deviceList) => {
    const stillThere = deviceList.findIndex(
      ({ deviceId }) => deviceId === activeCamera.value?.camera?.deviceId
    )

    cameraList.value = deviceList.map((camera, index) => ({
      camera,
      activate: (videEl, options) => {
        state.value = 'loading'
        activateCamera(videEl, index, options)
          .then(() => {
            activeCamera.value = cameraList.value[index]
            state.value = 'success'
          })
          .catch(() => {
            state.value = 'error'
          })
      }
    }))

    activeCamera.value = cameraList.value[stillThere > -1 ? stillThere : 0]
  })
}

export default function useCamera() {
  onActivated(() => {
    if (isCameraAvail()) {
      navigator.mediaDevices.addEventListener('devicechange', handleCameras)
      if (cameraList.value.length === 0) {
        handleCameras()
      }
    }
  })

  onDeactivated(() => {
    navigator.mediaDevices.removeEventListener('devicechange', handleCameras)
  })

  return {
    state,
    cameraList,
    activeCamera,
    setCameraByIndex: (index) => (activeCamera.value = cameraList.value[index]),
    setCameraByValue: (camera) => (activeCamera.value = camera)
  }
}
