extern crate wasm_bindgen;

#[macro_use]
extern crate lazy_static;

mod data_structs;
mod effects;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = wasmMemory)]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}
