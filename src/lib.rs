extern crate wasm_bindgen;
extern crate image;
extern crate imageproc;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,Rgba,GrayImage,ImageBuffer,Luma};
use image::imageops::FilterType::{Lanczos3,Nearest};
use imageproc::drawing::{draw_text_mut,draw_filled_rect_mut};
use imageproc::rect::Rect;
use rusttype::{Scale,Font};

static FONT_DATA: &[u8] = include_bytes!("consola.ttf");
const CHARACTERS: [char; 84] = ['-',':',',','_','^','~',';','!','>','<','=','*','/','r','+','?','c','L','(',')','v','7','i','T','s','l','z','t','J','x','u','n','f','Y','1','F','C','I','3','o','j','2','5','k','e','h','a','y','P','V','S','K','E','Z','w','X','U','4','b','6','9','p','m','d','q','G','A','#','O','R','H','D','%','8','B','W','N','M','$','0','Q','g','&','@'];

#[wasm_bindgen]
pub struct CanvasData { pub width: u32, pub height: u32, pub data_offset: *const u8, pub data_size: usize }

#[wasm_bindgen(js_name = wasmMemory)]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}

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

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: ascii_image.to_vec().as_ptr(),
        data_size: ascii_image.to_vec().len()
    }
}

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