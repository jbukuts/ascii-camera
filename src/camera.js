/**
 * Helper to see if camera is allowed
 *
 * @returns {boolean}
 */
function isCameraAvail() {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
}

/**
 * Helper to create video stream
 *
 * @param {Object} options options to get stream instance
 * @param {string} options.deviceId unqiue device id of video stream
 * @param {number[]} options.resolution width, height array of stream
 * @returns {Promise<MediaStream | null>}
 */
async function createVideoStream(options) {
  const {
    resolution: [width, height],
    deviceId
  } = options

  /** @type {MediaStreamConstraints} */
  const updatedConstraints = {
    video: {
      facingMode: 'user',
      frameRate: { ideal: 24, max: 30 },
      width: { ideal: width },
      height: { ideal: height },
      deviceId: {
        exact: deviceId
      }
    },
    audio: false
  }

  return navigator.mediaDevices.getUserMedia(updatedConstraints)
}

/**
 *  Helper to get list of video capable devices
 *
 * @returns {Promise<MediaDeviceInfo[]>}
 */
async function getCameraList() {
  if (!isCameraAvail()) {
    console.error('No camera available!')
    return null
  }

  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(
    (device) => device.kind === 'videoinput' && device.deviceId
  )

  return videoDevices
}

/**
 *
 * @param {HTMLVideoElement} videoObj
 * @param {Object} options
 * @param {MediaDeviceInfo} options.activeCamera
 * @param {number[]} options.resolution
 * @returns {Promise<boolean>}
 */
async function activateStream(videoEl, options) {
  const { activeCamera, resolution } = options

  try {
    const stream = await createVideoStream({
      deviceId: activeCamera.deviceId,
      resolution: resolution
    })

    // videoEl.srcObject?.getVideoTracks().forEach((track) => {
    //   console.info('removing track', track)
    //   track.stop()
    //   videoEl.srcObject.removeTrack(track)
    // })

    videoEl.srcObject = stream

    return true
  } catch (e) {
    console.error('Error activating stream:', e)
    return false
  }
}

export { getCameraList, isCameraAvail, createVideoStream, activateStream }
