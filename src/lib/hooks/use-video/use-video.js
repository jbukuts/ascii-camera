import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

const LISTENER_ATTR = 'data-listener'

export default function useVideo() {
  const videoRef = ref()

  const playVideo = () => videoRef.value.play()

  const addListener = () => {
    const hasListener = videoRef.value.getAttribute(LISTENER_ATTR)
    if (hasListener === 'true') return
    console.info('Adding event listener to video element')
    videoRef.value.addEventListener('loadedmetadata', playVideo)
    videoRef.value.setAttribute(LISTENER_ATTR, 'true')
  }

  const removeListener = () => {
    const videoEl = videoRef.value
    console.info('Removing camera tracks from video element')
    videoEl?.srcObject.getVideoTracks().forEach((track) => {
      track.stop()
      videoEl.srcObject.removeTrack(track)
    })

    videoEl?.removeEventListener('loadedmetadata', playVideo)
    videoEl.removeAttribute(LISTENER_ATTR)
  }

  onMounted(addListener)
  onActivated(addListener)
  onUnmounted(removeListener)
  onDeactivated(removeListener)

  // onActivated(() => {
  //   videoRef.value.addEventListener('loadedmetadata', playVideo)
  // })

  // onDeactivated(() => {
  //   console.log('removing camera tracks')
  //   videoRef.value?.srcObject.getVideoTracks().forEach((track) => {
  //     track.stop()
  //     videoRef.value.srcObject.removeTrack(track)
  //   })

  //   videoRef.value?.removeEventListener('loadedmetadata', playVideo)
  // })

  return videoRef
}
