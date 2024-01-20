extern crate wasm_bindgen;
extern crate image;
extern crate colorgrad;

use wasm_bindgen::prelude::*;
use image::{DynamicImage,RgbaImage,Pixel,Rgba};
use crate::data_structs::CanvasData;

// Minumum Bayer Matrix
const _BAYER_PATTERN_MIN: &[[u8; 2]; 2] = &[
  [0, 2],
  [3, 1]
];


//  16x16 Bayer Dithering Matrix.
const BAYER_PATTERN_16X16: &[[u8; 16]; 16] =  &[   
  [     0, 191,  48, 239,  12, 203,  60, 251,   3, 194,  51, 242,  15, 206,  63, 254  ], 
  [   127,  64, 175, 112, 139,  76, 187, 124, 130,  67, 178, 115, 142,  79, 190, 127  ],
  [    32, 223,  16, 207,  44, 235,  28, 219,  35, 226,  19, 210,  47, 238,  31, 222  ],
  [   159,  96, 143,  80, 171, 108, 155,  92, 162,  99, 146,  83, 174, 111, 158,  95  ],
  [     8, 199,  56, 247,   4, 195,  52, 243,  11, 202,  59, 250,   7, 198,  55, 246  ],
  [   135,  72, 183, 120, 131,  68, 179, 116, 138,  75, 186, 123, 134,  71, 182, 119  ],
  [    40, 231,  24, 215,  36, 227,  20, 211,  43, 234,  27, 218,  39, 230,  23, 214  ],
  [   167, 104, 151,  88, 163, 100, 147,  84, 170, 107, 154,  91, 166, 103, 150,  87  ],
  [     2, 193,  50, 241,  14, 205,  62, 253,   1, 192,  49, 240,  13, 204,  61, 252  ],
  [   129,  66, 177, 114, 141,  78, 189, 126, 128,  65, 176, 113, 140,  77, 188, 125  ],
  [    34, 225,  18, 209,  46, 237,  30, 221,  33, 224,  17, 208,  45, 236,  29, 220  ],
  [   161,  98, 145,  82, 173, 110, 157,  94, 160,  97, 144,  81, 172, 109, 156,  93  ],
  [    10, 201,  58, 249,   6, 197,  54, 245,   9, 200,  57, 248,   5, 196,  53, 244  ],
  [   137,  74, 185, 122, 133,  70, 181, 118, 136,  73, 184, 121, 132,  69, 180, 117  ],
  [    42, 233,  26, 217,  38, 229,  22, 213,  41, 232,  25, 216,  37, 228,  21, 212  ],
  [   169, 106, 153,  90, 165, 102, 149,  86, 168, 105, 152,  89, 164, 101, 148,  85  ]
];


#[wasm_bindgen(js_name = createOrderedDitherImage)]
pub fn create_ordered_dither_image(data: Vec<u8>, orig_width: u32, orig_height: u32) -> CanvasData {

    let orig_img: DynamicImage = DynamicImage::ImageRgba8(RgbaImage::from_vec(orig_width, orig_height, data).unwrap());
    let mut mod_image: RgbaImage = orig_img.into_rgba8();
    let p_size = 16;

    for (x, y, pixel) in mod_image.enumerate_pixels_mut() {
        let [r,g,b,a] = pixel.channels() else { todo!() };

        let col: usize = (x % p_size) as usize;
        let row: usize = (y % p_size) as usize;

        let val = BAYER_PATTERN_16X16[col][row];

        let new_r: u8 = if *r > val { 255 } else { 0 };
        let new_g: u8 = if *g > val { 255 } else { 0 };
        let new_b: u8 = if *b > val { 255 } else { 0 };

        *pixel = Rgba([new_r, new_g, new_b, *a]);
    }

    let img_vec = mod_image.to_vec();

    return CanvasData {
        width: orig_width,
        height: orig_height,
        data_offset: img_vec.as_ptr(),
        data_size: img_vec.len()
    }
}
