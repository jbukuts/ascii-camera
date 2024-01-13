import { onActivated, onDeactivated, ref } from 'vue'

export default function useVideo() {
  const videoRef = ref()

  const playVideo = () => videoRef.value.play()

  onActivated(() => {
    videoRef.value.addEventListener('loadedmetadata', playVideo)
  })

  onDeactivated(() => {
    console.log('removing camera tracks')
    videoRef.value?.srcObject.getVideoTracks().forEach((track) => {
      track.stop()
      videoRef.value.srcObject.removeTrack(track)
    })

    videoRef.value?.removeEventListener('loadedmetadata', playVideo)
  })

  return videoRef
}
