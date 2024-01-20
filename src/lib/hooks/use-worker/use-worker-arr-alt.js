import { useWebWorker } from '@vueuse/core'

const DEF_SHARE_SIZE = Uint8Array.BYTES_PER_ELEMENT * 1440 * 2560 * 4

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

  const test = [...new Array(count)].map(() => {
    return useWebWorker(
      new Worker(new URL('@/lib/workers/draw-worker.js', import.meta.url), {
        /* @vite-ignore */
        type: import.meta.env.DEV ? 'module' : 'classic'
      })
    )
  })

  const postToIndex = (index, ...args) => {
    test[index].post(...args)
  }

  const terminateIndex = (index) => {
    console.info('terminating worker', index)
    test[index].terminate()
  }

  return {
    workerArr: test,
    dataArr: test.map((w) => w.data),
    postToIndex,
    terminateIndex,
    sharedBuffer,
    sharedArr
  }
}

export default useWorkerArr
