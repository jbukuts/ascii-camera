<template>
  <div id="app">
    <h1><mark>ASCII Camera</mark></h1>

    <h3 v-if="mobile"><mark>This site does not work on mobile devices :(</mark></h3>

    <h3 v-if="!streamLoad"><mark>Is your camera connected? :(</mark></h3>

    <div v-if="!mobile && this.streamLoad">

      <picker :value="frameColor" @input="updateValue($event)"/>

      <select id="resolution" v-model="resReduce">
        <option disabled value="">Please select resolution</option>
        <option v-for="r in resolutions" v-bind:value="r[1]" v-bind:key="r[1]">
          {{ r[0] }}
        </option>
      </select>

      <video id="cam" autoplay="true" style="display:none" />
      <canvas id="canvas" width="640" height="480" style="display:none"></canvas>
      <canvas id="ascii" width="640" height="480" style="display:none"></canvas>
      <canvas id="final-ascii" width="640" height="480"></canvas>
    </div>

    <p>Look at the source code <a target="_blank" href="https://github.com/jbukuts/ascii-camera">here</a></p>
    <p>Written by Jake Bukuts</p>
    
  </div>
</template>

<script>
import json from './json/char_map.json';
import { isMobile } from 'mobile-device-detect';
import { Compact } from 'vue-color'


export default {
  name: 'App',
  components: {
    'picker': Compact
  },
  data() {
    return {
      mobile: isMobile,
      streamLoad: true,
      constraints: {
        video: { width: this.width, height: this.height },
        audio: false 
      },
      pickerColors: '#fff',
      stream: null,
      height: 480,
      width: 640,
      fontSize: 2,
      resReduce: 4,
      frameInt: null,
      frameColor: '#ddd',
      resolutions: [
        ['High', 3],
        ['Mid', 4],
        ['Low', 6],
        ['Absurdly Low', 8]
      ]
    }
  },
  // ran on page load
  async mounted() {
    // clear the interval
    clearInterval(this.frameInt);

    // if the site is mobile then just give up
    if (isMobile) 
      return;

    // get the video stream
    // check if null
    this.stream = await this.loadCamera(); 

    if (this.stream == null) {
      this.streamLoad = false;
      return;
    }

    let video = document.getElementById('cam');
    video.srcObject = this.stream;
    video.play();

    // get charset to equate to grayscale values
    // must be reduced
    let charSet = [...new Set(Object.values(json))];
    charSet = charSet.slice(charSet.length-255-2, charSet.length-1).reverse();

    let myImageData = null;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    // get the ghost canvas
    // normal image is here
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;

    console.log(this.stream);

    // where the ascii is drawn first
    // this is also a ghost canvas
    let asciiCanvas = document.getElementById('ascii');
    let ctxAscii = asciiCanvas.getContext('2d');
    asciiCanvas.width = this.width*this.fontSize;
    asciiCanvas.height = this.height*this.fontSize;

    // the actual canvas shown
    let finalCanvas = document.getElementById('final-ascii');
    let finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = asciiCanvas.width;
    finalCanvas.height = asciiCanvas.height;

    // create the actual frame interval
    this.frameInt = setInterval(async () => {
      // draw image from camera on canvas
      // get the pixel data from canvas
      await context.drawImage(video, 0, 0, this.width, this.height);
      myImageData = await context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      let pixels = myImageData.data;

      // convert to array of grayscale values
      // we can also reduce resolution here 
      // though we just sample every n pixel so its pretty bad downsampling
      let grayData = [];
      for (var i = 0; i < pixels.length; i += 4*this.resReduce)
        grayData.push(charSet[parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3)]);
      
      // what we want it to look like
      ctxAscii.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

      ctxAscii.fillStyle = '#000';
      ctxAscii.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);

      ctxAscii.fillStyle = this.frameColor;
      ctxAscii.font = `${this.fontSize*this.resReduce}px consola`;

      

      // time to actually draw 
      let c = this.fontSize;
      for(var j=0;j<(this.width*this.height); j+= this.width) {
        let row = grayData.slice(j, (j+this.width-1));
        let rowStr = row.reduce(reducer, "") + "\n";
        //let test = ctxAscii.measureText(rowStr).width;
        ctxAscii.fillText(rowStr, 0, c);
        c += this.fontSize*this.resReduce;
      }

      // we must resize the original ascii to be the proper size 
      // given text is not square
      finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.drawImage(asciiCanvas, 0, 0, (.54 * asciiCanvas.width), asciiCanvas.height, 0, 0, asciiCanvas.width, asciiCanvas.height);

      finalCanvas.style.width = `${window.innerWidth*.65}px`;

      // TODO: resize the canvas responsively
    }, 41);
  },
  destroyed() {
    // delete interval on destroy
    clearInterval(this.frameInt);
  },
  methods: {
    // init the camera on page load
    loadCamera() {
      return navigator.mediaDevices.getUserMedia(this.constraints).then((s) => {
        return s;
      },
      () => {
        return null
      });
    },
    updateValue(e) {
      console.log(e.hex);
      this.frameColor = e.hex;
    }
  }
}
</script>

<style>


@font-face {
  font-family: consola;
  src: url(consola.ttf);
}

@font-face {
  font-family: Inconsolata-Regular;
  src: url(Inconsolata-Regular.ttf);
}

html, body {
  margin: 0px;
}

html {
  background: rgb(22, 22, 22);
}

html::after {    
      content: "";
      background: url('./assets/static.png');
      position: fixed;
      z-index: -5;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      opacity: 0.10;
}

::-webkit-scrollbar {
  display: none;
}

#app {
  font-family: Inconsolata-Regular;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e2e2e2;
  text-align: center;
  margin-top: 60px;
}

#final-ascii {
  margin: auto;
  margin-top: 40px;
  border: 5px rgb(206, 206, 206) solid;
  border-radius: 40px;
  box-shadow: 0px 0px 100px 10px rgba(255, 255, 255, 0.15);
}

mark {
  padding: 8px;
  background: white;
  box-shadow: rgba(206, 206, 206, 0.527) 5px 5px;
}

h3 {
  margin-top: 10px;
}

a {
  color: #9e4897;
}

select {
  margin: auto;
  display: block;
  font-family: Inconsolata-Regular;
  margin-top: 10px;
}

.vc-compact {
  margin: auto;
  margin-top: 40px;
}

</style>
