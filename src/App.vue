<template>
  <div id="app">
    <h1 style="text-align: left">ascii camera</h1>
    <h3 v-if="this.mobile"><mark>This site does not work on mobile devices :(</mark></h3>

    <div id="camera-container" v-if="!this.mobile">
      <Camera v-bind:textColor="this.frameColor" v-bind:resolution="this.resReduce"/>
      <CameraControls 
        v-bind:updateColor="this.updateColor" 
        v-bind:updateResolution="this.updateResolution"
        v-bind:takePicture="this.takePicture"/>
    </div>

    <Footer/>
  </div>
</template>

<script>
import { isMobile } from 'mobile-device-detect';
import Camera from './components/Camera.vue';
import Footer from './components/Footer.vue';
import CameraControls from './components/CameraControls.vue';

export default {
  name: 'App',
  components: {
    'Camera': Camera,
    'Footer': Footer,
    'CameraControls': CameraControls
  },
  data() {
    return {
      mobile: isMobile,
      resReduce: 8,
      frameColor: '#fff'
    }
  },
  methods: {
    updateColor(e) {
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
