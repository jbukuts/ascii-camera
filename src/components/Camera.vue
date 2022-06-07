<template>
  <div id="camera-frame">
    <h3
      v-if="streamLoad === false"
      style="text-align: center; width: 100%; left: 0"
    >
      Is your camera connected?
    </h3>
    <h3
      v-if="streamLoad"
      style="margin: 10px"
    >
      {{ frameTime }} ms
    </h3>
    <video
      id="camera"
      ref="camera"
      autoplay="true"
      style="opacity: 0; position: fixed; pointer-events: none;"
    />
    <canvas
      id="final-ascii"
      height="480"
      width="640"
    />
  </div>
</template>

<script>
const fakeCanvas = document.createElement('canvas');
const fakeContext = fakeCanvas.getContext('2d');
 
export default {
    name: 'Camera',
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
            streamLoad: true,
            constraints: {
                video: { width: { ideal: 640 }, height: { ideal: 480 }},
                audio: false 
            },
            frameTime: 0
        }
    },
    async mounted() {
        navigator.mediaDevices.ondevicechange = async () => {
            console.log('update devices!');
            this.loadCamera();
        }
        this.loadCamera();
    },
    methods: {
        async loadCamera() {
            console.log('loading stream!');
            const loadStream = () => {
                return navigator.mediaDevices.getUserMedia(this.constraints).then(
                    (stream) => stream,
                    () => null
                );
            };

            const stream = await loadStream(); 
            this.streamLoad = stream !== null;
            if (stream === null) {
                this.streamLoad = false;
                return;
            }
            
            const video = this.$refs.camera;
            video.srcObject = stream;
            video.play();

            const finalCanvas = document.getElementById('final-ascii');
            const finalContext = finalCanvas.getContext('2d');

            const createRustFrame = async () => {
                try {
                    fakeCanvas.width = video.clientWidth;
                    fakeCanvas.height = video.clientHeight;
                    fakeContext.drawImage(video, 0, 0, fakeCanvas.width, fakeCanvas.height);
                    const { data: pixelData } = fakeContext.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height);

                    var startTime = performance.now();
                    const {width, height, data_offset, data_size} = this.effectFunction(
                        pixelData, 
                        fakeCanvas.width, 
                        fakeCanvas.height, 
                        this.resolution - (this.effectName !== 'ascii' ? 5 : 0),
                        this.bgColor, 
                        this.textColor
                    );
                    var endTime = performance.now();
                    this.frameTime = (endTime - startTime).toFixed(2);
                    finalCanvas.width = width;
                    finalCanvas.height = height;

                    const memory = this.wasmMemory(); 
                    const textureRaw = new Uint8ClampedArray(memory.buffer, data_offset, data_size);
                    const imageData = new ImageData(textureRaw, width, height);
                    finalContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
                    finalContext.putImageData(imageData, 0, 0);  
                }
                catch(e) {
                    console.error(`Problem drawing frame: ${e}`);
                }         
            };

            const createAsciiFrame = () => {
                createRustFrame().then(() => {
                    video.requestVideoFrameCallback(createAsciiFrame);
                });
            }
            video.requestVideoFrameCallback(createAsciiFrame);
        }
    }
}
</script>

<style scoped>
#camera-frame {
    width: fit-content;
    height: fit-content;
    margin: 0 auto;
}

#camera-frame > h3 {
    display: relative;
    color: white;
    position: absolute;
}

#final-ascii {
    background-color: black;
    display: block;
}

</style>
