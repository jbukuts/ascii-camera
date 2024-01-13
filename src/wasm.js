import init, {
  createAsciiImage as ascii,
  createDitherImage as badDither,
  createBadDitherImage as dither,
  wasmMemory as mem
} from '../pkg/jakes_photo_booth'

const wasmMem = new WebAssembly.Memory({
  initial: 25,
  maximum: 16384,
  shared: true
})

const loadWasm = async () => {
  await init(undefined, wasmMem)

  return {
    createAsciiImage: ascii,
    createBadDitherImage: dither,
    createDitherImage: badDither,
    wasmMemory: mem
  }
}

const {
  createAsciiImage,
  createBadDitherImage,
  createDitherImage,
  wasmMemory
} = await loadWasm()

export { createAsciiImage, createBadDitherImage, createDitherImage, wasmMemory }
