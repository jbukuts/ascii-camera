extern crate wasm_bindgen;
extern crate image;
extern crate colorgrad;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,Rgba};
use colorgrad::{Gradient,Color,CatmullRomGradient};
use phf::phf_map;
use crate::data_structs::CanvasData;

const RAINBOW: &[colorgrad::Color; 5] = &[
    Color::new(0.0, 0.0, 1.0, 1.0), // blue
    Color::new(0.0, 1.0, 1.0, 1.0), // cyan
    Color::new(0.0, 1.0, 0.0, 1.0), // green
    Color::new(1.0, 1.0, 0.0, 1.0), // yellow
    Color::new(1.0, 0.0, 0.0, 1.0), // red
];

const HOT_COLD: &[colorgrad::Color; 2] = &[
    Color::new(0.0, 0.0, 1.0, 1.0), // blue
    Color::new(1.0, 0.0, 0.0, 1.0), // red
];

static GRADIENTS: phf::Map<&'static str, &[colorgrad::Color]> = phf_map! {
    "rainbow" => RAINBOW,
    "icy_hot" => HOT_COLD
};

fn create_gradient(color_arr: &[colorgrad::Color]) -> CatmullRomGradient {
    return colorgrad::GradientBuilder::new()
        .colors(color_arr)
        .domain(&[0.0, 255.0])
        .build::<colorgrad::CatmullRomGradient>()
        .unwrap();
}

lazy_static! {
    static ref RAINBOW_GRAD: CatmullRomGradient = create_gradient(RAINBOW);
}

#[wasm_bindgen(js_name = createHeatImage)]
pub fn create_heat_image(data: Vec<u8>, orig_width: u32, orig_height: u32, gradient: Option<String>) -> CanvasData {
    let _gr_name: &str = &gradient.unwrap_or("rainbow".to_string());
    let _gr = GRADIENTS.get("rainbow").expect("REASON");

    let orig_img: DynamicImage = DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    let mut mod_image: RgbaImage = orig_img
        .adjust_contrast(40.0)
        .grayscale()
        .into_rgba8();

    let g = RAINBOW_GRAD.sharp(11, 0.0);
    for (_x, _y, pixel) in mod_image.enumerate_pixels_mut() {
        let rgba = g.at(pixel[0] as f32).to_rgba8();
        *pixel = Rgba(rgba);
    }

    let img_vec = mod_image.to_vec();

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: img_vec.as_ptr(),
        data_size: img_vec.len()
    }
}
