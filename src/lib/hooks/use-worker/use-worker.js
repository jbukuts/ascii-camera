import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

const DEF_SHARE_SIZE = Uint8Array.BYTES_PER_ELEMENT * 1440 * 2560 * 4

const createWorker = (name) => {
  return new Worker(new URL('@/lib/workers/draw-worker.js', import.meta.url), {
    /* @vite-ignore */
    type: import.meta.env.DEV ? 'module' : 'classic',
    name: name || crypto.randomUUID()
  })
}

function useWorker(sharedSize = DEF_SHARE_SIZE) {
  // create shared arr to contain source and final image pixel data
  // the main thread will draw the source image
  // the worker will then mutate to contain final image
  // eslint-disable-next-line no-undef
  const sharedBuffer = new SharedArrayBuffer(sharedSize)
  const sharedArr = new Uint8Array(sharedBuffer)
  const id = crypto.randomUUID()

  const worker = ref(null)
  const data = ref(null)

  const post = (...args) => {
    if (!worker.value) {
      console.warn("can't post to worker when none is created!")
      return
    }
    worker.value.postMessage(...args)
  }

  const terminate = () => {
    if (!worker.value) return
    console.info('terminating worker', id)
    worker.value.terminate()
    worker.value = undefined
  }

  const buildWorker = () => {
    if (window && !worker.value) {
      console.info('creating worker', id)
      const w = createWorker(id)
      w.onmessage = (e) => {
        data.value = e.data
      }

      w.onerror = (e) => {
        console.error(e)
      }

      worker.value = w
    }
  }

  onActivated(buildWorker)
  onMounted(buildWorker)
  onDeactivated(terminate)
  onUnmounted(terminate)

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
export { createWorker }
