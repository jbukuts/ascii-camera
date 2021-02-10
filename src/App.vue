<template>
  <div id="app">
    <h1><mark>ASCII Camera</mark></h1>

    <select id="resolution" v-model="resReduce">
      <option disabled value="">Please select resolution</option>
      <option v-for="r in resolutions" v-bind:value="r[1]" v-bind:key="r[1]">
        {{ r[0] }}
      </option>
    </select>

    <select v-model="frameColor" id="frameColor">
      <option disabled value="">Please select color</option>
      <option v-for="c in colors" v-bind:value="c[1]" v-bind:key="c[1]">
        {{ c[0] }}
      </option>
    </select>

    <video id="cam" autoplay="true" style="display:none" />
    <canvas id="canvas" width="640" height="480" style="display:none"></canvas>
    <canvas id="ascii" width="640" height="480" style="display:none"></canvas>
    <canvas id="final-ascii" width="640" height="480"></canvas>
  </div>
</template>

<script>
import json from './json/char_map.json';
//import { reshape } from 'mathjs'

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      constraints: {
        video: { width: this.width, height: this.height },
        audio: false 
      },
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
        ['Low', 6]
      ],
      colors: [
        ['White', '#ddd'],
        ['Red', 'red'],
        ['Blue', 'blue']
        ]
    }
  },
  async mounted() {

    // clear the interval
    clearInterval(this.frameInt);

    // get the video stream
    this.stream = await this.loadCamera(); 
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
      for (var i = 0; i < pixels.length; i += 4*this.resReduce) {
        let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        grayData.push(charSet[lightness]);
      }

      // where the ascii is drawn first
      // this is also a ghost canvas
      let asciiCanvas = document.getElementById('ascii');
      let ctxAscii = asciiCanvas.getContext('2d');
      asciiCanvas.width = this.width*this.fontSize;
      asciiCanvas.height = this.height*this.fontSize;

      // what we want it to look like
      ctxAscii.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);
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

      // the actual canvas show
      let finalCanvas = document.getElementById('final-ascii');
      let finalCtx = finalCanvas.getContext('2d');
      finalCanvas.width = asciiCanvas.width;
      finalCanvas.height = asciiCanvas.height;

      // we must resize the original ascii to be the proper size 
      // given text is not square
      finalCtx.drawImage(asciiCanvas, 0, 0, (.54 * asciiCanvas.width), asciiCanvas.height, 0, 0, asciiCanvas.width, asciiCanvas.height);
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
      })
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

html {
  background: rgb(22, 22, 22);
  overflow: hidden;
}

html::before {    
      content: "";
      background-image: url(https://www.dropbox.com/s/h7ab1c82ctzy83n/noise.png?raw=1);
      position: absolute;
      background-size: auto;
      z-index: -5;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      opacity: 0.05;
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
  margin-top: -80px;
  transform: scale(.8);
  border: 5px rgb(206, 206, 206) solid;
  border-radius: 40px;
}

mark {
  padding: 8px;
  background: white;
  box-shadow: rgba(206, 206, 206, 0.527) 5px 5px;
}

select {
  margin: auto;
  display: block;
  font-family: Inconsolata-Regular;
}

</style>
