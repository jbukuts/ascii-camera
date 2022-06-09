# ascii-camera-reborn

Originally created this project as for an assignment for MART 380 in college.
Rewritten now to have more effects (ascii / binary dithering) as well as to use Web Assembly for improved performance.

Built using [Vue 2]()

## Project Setup
A prereq to run this project locally is the installation of both `wasm-pack` and the Rust compiler in order to be able to compile the Rust script as a wasm module that can be imported via npm. 

Docs on installing Rust are available [here](https://www.rust-lang.org/tools/install)

Docs on `wasm-pack` are available [here](https://github.com/rustwasm/wasm-pack)

Once `wasm-pack` is installed you can run `npm ci` from the project root directory to install dependencies. Notice in the `package.json` for the `preinstall` script `wasm-pack` is ran in order to create the WASM module.

Any changes made to the `src/lib.rs` file will require a rebuild of the WASM module by running `npm run build:wasm`.

## Scripts
- `npm run serve`: Compiles and hot-reloads for development
- `npm run build`: Compiles and minifies for production
- `npm run lint`: Lints and fixes files

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
