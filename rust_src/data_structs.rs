extern crate wasm_bindgen;

use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct CanvasData { 
  pub width: u32, 
  pub height: u32, 
  pub data_offset: *const u8, 
  pub data_size: usize 
}
