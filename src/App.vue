<template>
  <div id="app">
    <h1 style="text-align: left">
      ascii_camera_reborn
    </h1>

    <div
      id="camera-container"
    >
      <collapse-transition>
        <Camera 
          v-if="cameraShow && wasmEffects"
          :text-color="frameColor" 
          :bg-color="bgColor" 
          :resolution="resReduce"
          :effect-function="wasmEffects[effectIndex][1]"
          :effect-name="wasmEffects[effectIndex][0] || ''"
          :wasm-memory="wasmMemory"
        />
        <Upload 
          v-if="!cameraShow && wasmEffects"
          :text-color="frameColor" 
          :bg-color="bgColor" 
          :resolution="resReduce"
          :effect-function="wasmEffects[effectIndex][1]"
          :effect-name="wasmEffects[effectIndex][0] || ''"
          :wasm-memory="wasmMemory"
        />
      </collapse-transition>
      
      
      <CameraControls
        v-if="wasmEffects"
        :toggle-view="toggleView"
        :update-fg-color="updateFgColor" 
        :update-bg-color="updateBgColor" 
        :update-resolution="updateResolution"
        :update-effect="updateEffect"
        :take-picture="takePicture"
        :camera-mode="cameraShow"
        :effect="wasmEffects[effectIndex][0] || ''"
      />
    </div>

    <Footer />
  </div>
</template>

<script>
import {CollapseTransition} from 'vue2-transitions'
import { isMobile } from 'mobile-device-detect';
import Camera from './components/Camera.vue';
import Footer from './components/Footer.vue';
import CameraControls from './components/CameraControls.vue';
import Upload from './components/Upload.vue';

export default {
    name: 'App',
    components: {
        'Camera': Camera,
        'Footer': Footer,
        'CameraControls': CameraControls,
        'Upload': Upload,
        'CollapseTransition': CollapseTransition
    },
    data() {
        return {
            mobile: isMobile,
            resReduce: 12,
            frameColor: [255,255,255],
            bgColor: [0,0,0],
            cameraShow: !isMobile,
            wasmEffects: null,
            wasmMemory: null,
            effectIndex: 0
        }
    },
    async mounted() {
        await import('wasm_test').then((wasm) => {
            const {createAsciiImage, createDitherImage, createBadDitherImage, wasmMemory} = wasm;
            this.wasmMemory = wasmMemory;
            this.wasmEffects = [
                ['ascii', createAsciiImage],
                ['bin_dither', createDitherImage],
                ['glitch_dither', createBadDitherImage]
            ];
            console.log('Successfully loaded wasm module!');
        }).catch((err) => console.error("Failed to load wasm module" + err));
    },
    methods: {
        toggleView() {
            this.cameraShow = !this.cameraShow;
        },
        updateEffect() {
            this.effectIndex = this.effectIndex <  this.wasmEffects.length - 1 ? this.effectIndex+1 : 0;
        },
        updateBgColor(e) {
            this.bgColor = e.hex;
        },
        updateFgColor(e) {
            this.frameColor = e.hex;
        },
        updateResolution(e) {
            this.resReduce = parseInt(e.target.value);
        },
        takePicture() {
            console.log('taking picture!');
            const frameCanvas = document.getElementById('final-ascii');
            const link = document.createElement("a");
            link.download = 'download.png';
            link.href = frameCanvas.toDataURL();
            link.click();  
            link.delete;
        }
    }
}
</script>

<style>
@font-face {
  font-family: consola;
  src: url(consola.ttf);
}

html, body {
  margin: 0px;
  user-select: none;
}

html {
  background: rgb(235, 235, 235);
}

html::after {    
  content: "";
  background: url('./assets/static.png');
  position: fixed;
  z-index: -2;
  top: 0px;
  filter: grayscale(1);
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.4;
}

::-webkit-scrollbar {
  display: none;
}

#app {
  color: black;
  text-align: center;
  padding-top: 4rem;
  font-family: consola;
  width: fit-content;
  margin: 0 auto
}

#camera-container {
  border-radius: 1rem;
  overflow: hidden;
  width: fit-content;
  margin: 0 auto;
  height: fit-content;
}

</style>
