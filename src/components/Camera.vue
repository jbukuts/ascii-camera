<template>
    <div id="camera-frame">
        <h3 v-if="this.streamLoad === false">): Is your camera connected? :(</h3>
        <video id="camera" autoplay="true" style="display:none"/>
        <canvas id="final-ascii" height="480" width="640"/>
    </div>
</template>

<script>
import convertToAscii from '../helpers/convertToAscii';

export default {
    name: 'Camera',
    props: {
        textColor: String,
        resolution: Number,
    },
    data() {
        return {
            streamLoad: true,
            frameInt: null,
            constraints: {
                video: { width: this.width, height: this.height },
                audio: false 
            }
        }
    },
    async mounted() {
        this.loadCamera();

        navigator.mediaDevices.ondevicechange = async () => {
            console.log('update devices!');
            this.loadCamera();
        }
    },
    destroyed() {
        // delete interval on destroy
        clearInterval(this.frameInt);
    },
    methods: {
        async loadCamera() {
            clearInterval(this.frameInt);

            const loadStream = () => {
                return navigator.mediaDevices.getUserMedia(this.constraints).then(
                    (s) => s,
                    () => null
                );
            };
            
            // get the video stream
            // check if null
            this.stream = await loadStream(); 
            this.streamLoad = this.stream !== null;
            if (this.stream == null)
                return;
            
            let video = document.getElementById('camera');
            video.srcObject = this.stream;
            video.play();

            const finalCanvas = document.getElementById('final-ascii');
            const finalContext = finalCanvas.getContext('2d');

            // create the actual frame interval
            this.frameInt = setInterval(async () => {
                convertToAscii(video, this.textColor, this.resolution, finalContext);
            }, 50);
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
    color: white;
    position: absolute;
    left: 0;
    right: 0;
    top: 18rem;
}

#final-ascii {
    background-color: black;
}

</style>
