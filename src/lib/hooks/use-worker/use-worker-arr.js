import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

const DEF_SHARE_SIZE = Uint8Array.BYTES_PER_ELEMENT * 1440 * 2560 * 4

const createWorker = (name) => {
  return new Worker(new URL('@/lib/workers/draw-worker.js', import.meta.url), {
    /* @vite-ignore */
    type: import.meta.env.DEV ? 'module' : 'classic',
    name: name || crypto.randomUUID()
  })
}

/**
 * Creates a set of workers to use
 *
 * @param {number} count amount of workers to be created
 * @param {number} sharedSize byte size of shared buffer between workers
 * @returns
 */
function useWorkerArr(count = 2, sharedSize = DEF_SHARE_SIZE) {
  // create shared arr to contain source and final image pixel data
  // the main thread will draw the source image
  // the worker will then mutate to contain final image
  // eslint-disable-next-line no-undef
  const sharedBuffer = new SharedArrayBuffer(sharedSize)
  const sharedArr = new Uint8Array(sharedBuffer)
  const id = crypto.randomUUID()

  const workerArr = ref([...new Array(count)])
  const dataArr = ref([...new Array(count)])

  const postToIndex = (index, ...args) => {
    if (!workerArr.value[index]) {
      console.warn("can't post to worker when none is created!")
      return
    }
    workerArr.value[index].postMessage(...args)
  }

  const terminateIndex = (index) => {
    if (!workerArr.value[index]) return
    console.info('terminating worker', index)
    workerArr.value[index].terminate()
    workerArr.value[index] = undefined
  }

  const buildWorker = (index) => {
    if (window && !workerArr.value[index]) {
      console.info('creating worker', index)
      const w = createWorker(id)
      w.onmessage = (e) => {
        dataArr.value[index] = e.data
      }

      w.onerror = (e) => {
        console.error(e)
      }

      workerArr.value[index] = w
    }
  }

  const createWorkers = () => {
    for (let i = 0; i < count; i++) {
      buildWorker(i)
    }
  }

  const terminateWorkers = () => {
    for (let i = 0; i < count; i++) {
      terminateIndex(i)
    }
  }

  onActivated(createWorkers)
  onMounted(createWorkers)
  onDeactivated(terminateWorkers)
  onUnmounted(terminateWorkers)

  return {
    workerArr,
    dataArr,
    postToIndex,
    terminateIndex,
    sharedBuffer,
    sharedArr
  }
}

export default useWorkerArr
