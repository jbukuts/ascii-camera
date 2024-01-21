extern crate wasm_bindgen;
extern crate image;
extern crate imageproc;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,GrayImage,ImageBuffer};
use image::imageops::FilterType::{Nearest};
use crate::data_structs::CanvasData;

#[wasm_bindgen(js_name = createDitherImage)]
pub fn dither_image(data: Vec<u8>, orig_width: u32, orig_height: u32, down_size: u32, bg_color: &[u8], fg_color: &[u8]) -> CanvasData {
    let orig_img: DynamicImage = DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    let new_width: u32 = (orig_width / down_size) as u32;
    let new_height: u32 = (orig_height / down_size) as u32;
    
    let mut mod_image: Vec<f32> = if down_size == 1 { orig_img } 
        else { orig_img.resize(new_width, new_height, Nearest) }
        .to_luma32f()
        .into_vec()
        .iter().map(|&e| {
            e * 255.0
        }).collect();

    let modifer = |(val, r, err): (&mut f32,f32, f32)| -> Option<f32> { *val += err * r; None };
    for y in 0..new_height {
        for x in 0..new_width {
            let i: usize = (y*new_width + x) as usize;

            let old_pixel: f32 = mod_image[i];
            let new_pixel: f32 = if mod_image[i] > 127.0 { 255.0 } else { 0.0 };
            mod_image[i] = new_pixel;
            let quant_error = old_pixel - new_pixel;

            let r_top: usize = (y*new_width + x + 1) as usize;
            let r_bot: usize = ((y+1)*new_width + x + 1) as usize;
            let m_bot: usize = ((y+1)*new_width + x) as usize;
            let l_bot: usize = ((y-1)*new_width + x - 1) as usize;

            (mod_image.get_mut(r_top)).map(|x: &mut f32| (x, 0.4375, quant_error)).and_then(modifer);
            (mod_image.get_mut(r_bot)).map(|x: &mut f32| (x, 0.1875, quant_error)).and_then(modifer);
            (mod_image.get_mut(m_bot)).map(|x: &mut f32| (x, 0.3125, quant_error)).and_then(modifer);
            (mod_image.get_mut(l_bot)).map(|x: &mut f32| (x, 0.0625, quant_error)).and_then(modifer);
        }
    }

    let test_vec: Vec<u8> = mod_image.iter().map(|&e| {
        e as u8
    }).collect();
    let test_buffer: GrayImage = ImageBuffer::from_vec(new_width, new_height, test_vec).unwrap();
    let final_buff: RgbaImage = if down_size == 1 { DynamicImage::ImageLuma8(test_buffer) } 
        else { DynamicImage::ImageLuma8(test_buffer).resize(orig_width, orig_height, Nearest) }
        .into_rgba8();
        
    let final_width: u32 = final_buff.width();  
    let final_height: u32 = final_buff.height();   
    let mut final_vec: Vec<u8> = final_buff.into_vec();
    let vec_size = final_vec.len();

    for v in 0..(vec_size / 4) {
        let p = v*4;
        if final_vec[p] > 127 {
            final_vec[p] = fg_color[0];
            final_vec[p+1] = fg_color[1];
            final_vec[p+2] = fg_color[2];
        }
        else {
            final_vec[p] = bg_color[0];
            final_vec[p+1] = bg_color[1];
            final_vec[p+2] = bg_color[2];
        }
    }

    return CanvasData {
        width: final_width,
        height: final_height,
        data_offset: final_vec.as_ptr(),
        data_size: vec_size
    }
}
