<template>
  <div id="upload-container">
    <label id="file-upload">
      <input
        ref="file-input"
        accept="image/*"
        type="file"
        @change="applyEffect"
      >
      choose_image
    </label>
    <div>
      <PinchZoom :disable-zoom-control="'disable'">
        <img 
          id="converted-img"
          :v-if="base64Img != null && !isError && !isLoading" 
          :src="base64Img"
        >
      </PinchZoom>
    </div>
  </div>
</template>

<script>
import PinchZoom from 'vue-pinch-zoom';

const fakeCanvas = document.createElement('canvas');
const fakeContext = fakeCanvas.getContext('2d');

export default {
    name: 'Upload',
    components: {
        'PinchZoom': PinchZoom
    },
    props: {
        textColor: {
            type: Array,
            required: true
        },
        bgColor: {
            type: Array,
            required: true
        },
        resolution: {
            type: Number,
            required: true
        },
        effectFunction: {
            type: Function,
            required: true
        },
        effectName: {
            type: String,
            required: true
        },
        wasmMemory: {
            type: Function,
            required: true
        }
    },
    data() {
        return { 
            wasm: null,
            base64Img: null,
            isLoading: false,
            isError: false
        }
    },
    methods: {
        applyEffect() {  
            this.isLoading = true;
            try {
                const input = this.$refs['file-input'];
                var fr = new FileReader();
                fr.onload = () => {
                    const img = new Image();
                    img.onload = async () => {
                        fakeCanvas.height = img.height;
                        fakeCanvas.width = img.width;
                        fakeContext.drawImage(img, 0, 0);
                        const { data: pixelData } = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);

                        const {width, height, data_offset, data_size} = this.effectFunction(
                            pixelData, 
                            fakeCanvas.width, 
                            fakeCanvas.height, 
                            this.resolution - (this.effectName !== 'ascii' ? 5 : 0),
                            this.bgColor, 
                            this.textColor
                        );

                        const memory = this.wasmMemory(); 
                        const textureRaw = new Uint8ClampedArray(memory.buffer, data_offset, data_size);
                        const imageData = new ImageData(textureRaw, width, height);
                        fakeContext.putImageData(imageData, 0, 0);

                        this.base64Img = fakeCanvas.toDataURL();
                        this.isLoading = false;
                        this.isError = false;
                       
                    };
                    img.src = fr.result;
                };
                fr.readAsDataURL(input.files[0]);

            }
            catch {
                this.isLoading = false;
                this.isError = true;
            }
        }
    }
}
</script>

<style scoped>
#upload-container {
   background: black;
   padding: 2rem 0;
   display: inline-block;
   width: 100%;
}

.pinch-zoom-wrapper {
   aspect-ratio: auto;
   max-width: 500px;
   border-radius: 15px;
   margin: auto;
}

input[type="file"] {
    display: none;
}

#file-upload {
    color: white;
    border: 1px solid #ccc;
    display: inline-block;
    padding: .5rem 1.5rem;
    cursor: pointer;
    margin: 2rem 1rem;
    transition: all .15s ease-in-out;
    border-radius: 1rem;
}

#file-upload:hover {
    color: black;
    background: white;
}

</style>
