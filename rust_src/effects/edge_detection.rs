extern crate wasm_bindgen;
extern crate image;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,GrayImage,RgbaImage,Pixel};
use imageproc::edges::canny;
use image::buffer::ConvertBuffer;
use crate::data_structs::CanvasData;


#[wasm_bindgen(js_name = createEdgeImage)]
pub fn create_heat_image(data: Vec<u8>, orig_width: u32, orig_height: u32) -> CanvasData {
    let orig_img: DynamicImage = DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    
    // grayscale image and apply gausian blue
    let mut mod_image: RgbaImage = orig_img
        .adjust_contrast(40.0)
        .grayscale()
        .blur(0.5)
        .into_rgba8();

    // apply Canny algorithm
    let canny_image: GrayImage = canny(&mod_image.convert(), 30.0, 150.0);
    
    // mutate original image with pixels from grayscale image
    for (x, y, pixel) in mod_image.enumerate_pixels_mut() {
      let v = canny_image.get_pixel(x,y);
      *pixel = v.to_rgba();
    } 

    let img_vec = mod_image.to_vec();

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: img_vec.as_ptr(),
        data_size: img_vec.len()
    }
}
