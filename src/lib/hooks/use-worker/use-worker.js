import { onActivated, onDeactivated, ref } from 'vue'

const createWorker = () => {
  return new Worker(new URL('@/lib/workers/draw-worker.js', import.meta.url), {
    /* @vite-ignore */
    type: import.meta.env.DEV ? 'module' : 'classic'
  })
}

const useWorker = (
  sharedSize = Uint8Array.BYTES_PER_ELEMENT * 1440 * 2560 * 4
) => {
  // create shared arr to contain source and final image pixel data
  // the main thread will draw the source image
  // the worker will then mutate to contain final image
  // eslint-disable-next-line no-undef
  const sharedBuffer = new SharedArrayBuffer(sharedSize)
  const sharedArr = new Uint8Array(sharedBuffer)

  const worker = ref(null)
  const data = ref(null)

  const post = (...args) => {
    if (!worker.value) return
    worker.value.postMessage(...args)
  }

  const terminate = () => {
    if (!worker.value) return
    worker.value.terminate()
  }

  onActivated(() => {
    console.log('creating worker')
    if (window) {
      const w = createWorker()
      w.onmessage = (e) => {
        data.value = e.data
      }

      w.onerror = (e) => {
        console.log(e)
      }
      worker.value = w
    }
  })

  onDeactivated(() => {
    console.info('terminating worker')
    if (worker.value) worker.value.terminate()
  })

  return {
    worker,
    data,
    post,
    terminate,
    sharedBuffer,
    sharedArr
  }
}

export default useWorker
