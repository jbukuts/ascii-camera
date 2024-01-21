extern crate wasm_bindgen;
extern crate image;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,GrayImage,Luma};
use crate::data_structs::CanvasData;

#[wasm_bindgen(js_name = createBadDitherImage)]
pub fn bad_dither_image(data: Vec<u8>, orig_width: u32, orig_height: u32, _down_size: u32, _bg_color: &[u8], _fg_color: &[u8]) -> CanvasData {
    let orig_img: DynamicImage = DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    let mut mod_image: GrayImage = orig_img.into_luma8();

    for i in 0..((orig_height*orig_width)-1) {
        let x: u32 = (i as u32 % orig_width) as u32;
        let y: u32 = (i as u32 / orig_width) as u32;

        let old_pixel: Luma<u8> = *mod_image.get_pixel(x, y);
        let mut new_pixel: u8 = 255;
        if old_pixel[0] > 127 {
            mod_image.put_pixel(x,y, Luma ([255]));
        }
        else {
            mod_image.put_pixel(x,y, Luma ([0]));
            new_pixel = 0;
        }

        let quant_error = old_pixel[0] - new_pixel;

        let r_bot: Option<&Luma<u8>> = mod_image.get_pixel_checked(x+1,y);
        if r_bot.is_some() {
            let p: u8 = r_bot.unwrap()[0] + ((quant_error * 7) >> 4);
            mod_image.put_pixel(x+1,y, Luma ([p]) );
        }

        let r_top: Option<&Luma<u8>> = mod_image.get_pixel_checked(x+1,y+1);
        if r_top.is_some() {
            let p: u8 = r_top.unwrap()[0] + (quant_error >> 4);
            mod_image.put_pixel(x+1,y+1, Luma ([p]) );
        }

        let m_bot: Option<&Luma<u8>> = mod_image.get_pixel_checked(x,y+1);
        if m_bot.is_some() {
            let p: u8 = m_bot.unwrap()[0] + ((quant_error * 5) >> 4);
            mod_image.put_pixel(x,y+1, Luma ([p]) );
        }

        let l_bot: Option<&Luma<u8>> = mod_image.get_pixel_checked(x-1,y-1);
        if l_bot.is_some() {
            let p: u8 = l_bot.unwrap()[0] + ((quant_error * 3) >> 4);
            mod_image.put_pixel(x-1,y-1, Luma ([p]));
        }
    }


    let final_vec: Vec<u8> = DynamicImage::ImageLuma8(mod_image).into_rgba8().to_vec();

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: final_vec.as_ptr(),
        data_size: final_vec.len()
    }
}
