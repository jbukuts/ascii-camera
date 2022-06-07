<template>
  <div id="camera-controls">
    <div
      class="section"
      style="text-align: left"
    >
      <p
        :class="effect !== 'glitch_dither' ? 'option-item' : 'option-item disabled'"
        @click="incrementFgColor()"
      >
        fg_color: {{ fgColors[fgColorIndex][0] }}
      </p>
      <p
        :class="effect !== 'glitch_dither' ? 'option-item' : 'option-item disabled'"
        @click="incrementBgColor()"
      >
        bg_color: {{ bgColors[bgColorIndex][0] }}
      </p>
      <p
        :class="effect !== 'glitch_dither' ? 'option-item' : 'option-item disabled'"
        @click="incrementResolution()"
      >
        quality: {{ resolutions[resolutionIndex][0] }}
      </p>
      <p
        class="option-item"
        @click="updateEffect()"
      >
        effect: {{ effect }}
      </p>
    </div>

    <div class="section">
      <button
        id="picture-button"
        :class="cameraMode ? '' : 'disabled'"
        @click="takePicture()"
      >
        <font-awesome-icon icon="camera" />
      </button>
    </div>

    <div
      class="section"
      style="text-align: right"
    >
      <p
        class="option-item"
        @click="toggleView()"
      >
        {{ cameraMode ? 'upload_image' : 'camera_view' }}
      </p>
    </div>
  </div>
</template>

<script>

export default {
    name: 'CameraControls',
    props: {
        updateFgColor: {
            type: Function,
            required: true
        },
        updateBgColor: {
            type: Function,
            required: true
        },
        updateResolution: {
            type: Function,
            required: true
        },
        updateEffect: {
            type: Function,
            required: true
        },
        takePicture: {
            type: Function,
            required: true
        },
        toggleView: {
            type: Function,
            required: true
        },
        cameraMode: {
            type: Boolean,
            required: true
        },
        effect: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            resolutions: [
                ['very_low', 12],
                ['low', 10],
                ['medium', 8],
                ['high', 6]
            ],
            fgColors: [
                ["white", [255,255,255]],
                ["black", [0,0,0]],
                ["red", [255,0,0]],
                ["green", [0,255,0]],
                ["blue", [0,0,255]]
            ],
            bgColors: [
                ["black", [0,0,0]],
                ["white", [255,255,255]],
                ["red", [255,0,0]],
                ["green", [0,255,0]],
                ["blue", [0,0,255]]
            ],
            fgColorIndex: 0,
            bgColorIndex: 0,
            resolutionIndex: 0
        }
    },
    methods: {
        incrementBgColor() {
            this.bgColorIndex = this.bgColorIndex <  this.bgColors.length - 1 ? this.bgColorIndex+1 : 0;
            this.updateBgColor({ hex: this.bgColors[this.bgColorIndex][1] });
        },
        incrementFgColor() {
            this.fgColorIndex = this.fgColorIndex < this.fgColors.length - 1 ? this.fgColorIndex+1 : 0;
            this.updateFgColor({ hex: this.fgColors[this.fgColorIndex][1] });
        },
        incrementResolution() {
            this.resolutionIndex = this.resolutionIndex < this.resolutions.length - 1 ? this.resolutionIndex+1 : 0;
            this.updateResolution({ target: { value: this.resolutions[this.resolutionIndex][1] }});
        }
    }
}
</script>

<style scoped>

#camera-controls {
    width: 640px;
    height: fit-content;
    background-color: black;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rem;
    color: white;
    align-items: center;
    display: flex;
}

.section {
  flex: 1 1 0px
}

#picture-button {
  border-radius: 50%;
  height: 4rem;
  width: 4rem;
  border: none;
  background-color: rgb(216, 38, 38);
  transition: all .05s ease-in-out;
}

#picture-button:hover {
  cursor: pointer;
  background-color: rgb(142, 0, 0);;
}

#picture-button:active {
  background-color: rgb(102, 0, 0);
  border: 1px solid #ccc;
}

.svg-inline--fa {
  height: 1.5rem !important;
  width: 1.5rem !important;
  color: white;
}

.option-item {
  margin: .5rem 0px;
}

.option-item:hover {
  text-decoration: underline;
  cursor: pointer;
}

.disabled {
  opacity: .5;
  pointer-events: none;
}
</style>