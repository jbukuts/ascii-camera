# ascii-camera-reborn

Originally created this project as for an assignment for MART 380 in college.
Rewritten now to have more effects (ascii / binary dithering) as well as to use Web Assembly for improved performance.

Built using [Vue 2]()

## Project Setup
A prereq to run this project locally is the installation of both `wasm-pack` and the Rust compiler in order to be able to compile the Rust script as a wasm module that can be imported locally via npm. 

Docs on installing Rust are available [here](https://www.rust-lang.org/tools/install)

Docs on `wasm-pack` are available [here](https://github.com/rustwasm/wasm-pack)

Once `wasm-pack` is installed you can run `npm ci` from the project root directory to install dependencies. Notice in the `package.json` the `jakes-photo-booth` dependency references a local folder. This is where the compiled WASM module lives.

Now you can run `npm run dev` to start the local dev server and navigate to `https://localhost:8080` to see the site. 

The actual source for the WASM module lives in the `src/lib.rs` script. Any changes made to the file will result in a recompile of the module automatically if you are running the `dev` script.

## Scripts
- `npm run dev`: Compiles the WASM module and hot-reloads for development
- `npm run dev:vue`: Runs local Vue development server
- `npm run dev:rust`: Compiles the WASM module and watches for changes
- `npm run build`: Compiles and minifies for production
- `npm run build:rust`: Just compiles the WASM module
- `npm run serve:prod`: Runs a local server hosting the static site. Requires Python 3
- `npm run lint`: Lints and fixes files

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
