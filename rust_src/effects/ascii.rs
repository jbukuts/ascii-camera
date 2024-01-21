extern crate wasm_bindgen;
extern crate image;
extern crate imageproc;
extern crate colorgrad;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,Rgba};
use image::imageops::FilterType::{Lanczos3};
use imageproc::drawing::{draw_text_mut,draw_filled_rect_mut};
use imageproc::rect::Rect;
use rusttype::{Scale,Font};
use crate::data_structs::CanvasData;

static FONT_DATA: &[u8] = include_bytes!("../consola.ttf");
const CHARACTERS: [char; 84] = ['-',':',',','_','^','~',';','!','>','<','=','*','/','r','+','?','c','L','(',')','v','7','i','T','s','l','z','t','J','x','u','n','f','Y','1','F','C','I','3','o','j','2','5','k','e','h','a','y','P','V','S','K','E','Z','w','X','U','4','b','6','9','p','m','d','q','G','A','#','O','R','H','D','%','8','B','W','N','M','$','0','Q','g','&','@'];

#[wasm_bindgen(js_name = createAsciiImage)]
pub fn create_ascii_image(data: Vec<u8>, orig_width: u32, orig_height: u32, down_size: u32, bg_color: &[u8], fg_color: &[u8]) -> CanvasData {
    // read in original image
    let orig_img: DynamicImage = image::DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    let new_width: u32 = (orig_width / down_size) as u32;
    let new_height: u32 = (orig_height / down_size) as u32;

    // // settings for ascii image
    let font: Font<'static> = Font::try_from_bytes(FONT_DATA).unwrap();
    let scale = Scale {
        x: (down_size as f32 * 1.85) as f32,
        y: down_size as f32
    };

    let bg = Rgba ([bg_color[0], bg_color[1], bg_color[2], 255]);
    let fg = Rgba ([fg_color[0], fg_color[1], fg_color[2], 255]);

    // modify the image
    let mod_image: RgbaImage = orig_img
        .resize(new_width, new_height, Lanczos3)
        .adjust_contrast(45.0)
        .grayscale()
        .into_rgba8();

    // draw chars row by row
    let shifter: f32 = ((CHARACTERS.len() - 1) as f32) / 255.0;
    let mut ascii_image = RgbaImage::new(orig_width, orig_height);
    let r = Rect::at(0, 0).of_size(orig_width, orig_height);
    draw_filled_rect_mut(&mut ascii_image, r, bg);
    mod_image.rows().enumerate().for_each(|(i, row)| {
        let ascii_string = row.fold("".to_string(), |mut acc: String, curr: &Rgba<u8>| {
            let gray_val: f32 = curr[0].into();
            let ch: char = CHARACTERS[(shifter * gray_val) as usize];
            acc.push(ch);
            acc
        }).to_owned();
        draw_text_mut(&mut ascii_image, fg, 0, (i * down_size as usize) as i32, scale, &font, &ascii_string);
    });

    let img_vec = ascii_image.to_vec();

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: img_vec.as_ptr(),
        data_size: img_vec.len()
    }
}
