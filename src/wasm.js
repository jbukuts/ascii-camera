import init, {
  createAsciiImage as ascii,
  createDitherImage as badDither,
  createBadDitherImage as dither,
  createEdgeImage as edge,
  createHeatImage as heatmap,
  wasmMemory as mem,
  createOrderedDitherImage as orderDither
} from '../pkg/jakes_photo_booth'

/** @typedef {Record<'ascii' | 'bin_dither' | 'glitch_dither', T>} EffectMap<T> */
/** @typedef {'quality' | 'fgColor' | 'bgColor'} AllowedParam */

const wasmMem = new WebAssembly.Memory({
  initial: 25,
  maximum: 16384,
  shared: false
})

const loadWasm = async () => {
  return init(undefined, wasmMem).then(() => ({
    createAsciiImage: ascii,
    createBadDitherImage: dither,
    createDitherImage: badDither,
    createHeatImage: heatmap,
    createEdgeImage: edge,
    orderedDither: orderDither,
    wasmMemory: mem
  }))
}

// const {
//   createAsciiImage,
//   createBadDitherImage,
//   createDitherImage,
//   createHeatImage,
//   createEdgeImage,
//   orderedDither,
//   wasmMemory
// } = loadWasm().then((r) => r)

const effectMap = (() => {
  return loadWasm().then((m) => ({
    ascii: m.createAsciiImage,
    bin_dither: m.createDitherImage,
    glitch_dither: m.createBadDitherImage,
    heat_map: m.createHeatImage,
    edge_detect: m.createEdgeImage,
    ordered_dither: m.orderedDither,
    wasmMemory: m.wasmMemory
  }))
})()

/** @type {EffectMap<Function>} */
// const effectMap = {
//   ascii: createAsciiImage,
//   bin_dither: createDitherImage,
//   glitch_dither: createBadDitherImage,
//   heat_map: createHeatImage,
//   edge_detect: createEdgeImage,
//   ordered_dither: orderedDither
// }

/** @type {EffectMap<Set>} */
const effectParams = {
  bin_dither: new Set(['quality', 'foreground', 'background']),
  ordered_dither: new Set([]),
  glitch_dither: new Set([]),
  edge_detect: new Set([]),
  heat_map: new Set([]),
  ascii: new Set(['quality', 'foreground', 'background'])
}

const effectList = Object.keys(effectParams)

export default effectMap
export {
  // createAsciiImage,
  // createBadDitherImage,
  // createDitherImage,
  // createHeatImage,
  // wasmMemory,
  effectList,
  effectParams
}
