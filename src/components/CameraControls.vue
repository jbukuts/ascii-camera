<template>
    <div id="camera-controls">

        <div>
            <p class="option-item" @click="incrementColor()">color</p>
            <p class="option-item" @click="incrementResolution()">resolution</p>
        </div>

        <button id="picture-button" @click="takePicture()">
            <font-awesome-icon icon="camera" />
        </button>
    </div>
</template>

<script>

export default {
    name: 'CameraControls',
    props: {
        updateColor: Function,
        updateResolution: Function,
        takePicture: Function
    },
    data() {
        return {
            resolutions: [
                ['absurdly low', 8],
                ['low', 6],
                ['medium', 4],
                ['high', 3]
            ],
            colors: [
                'white',
                'red',
                'orange',
                'green',
                'blue',
                'purple'
            ],
            colorIndex: 0,
            resolutionIndex: 0
        }
    },
    methods: {
        incrementColor() {
            this.colorIndex++;
            if (this.colorIndex > this.colors.length - 1)
                this.colorIndex = 0;

            const e = { hex: this.colors[this.colorIndex]};
            this.updateColor(e);
        },
        incrementResolution() {
            this.resolutionIndex++;
            if (this.resolutionIndex > this.resolutions.length - 1)
                this.resolutionIndex = 0;

            const e = { target: { value: this.resolutions[this.resolutionIndex][1] }};
            this.updateResolution(e);
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
    margin-top: -5px;
    align-items: center;
    display: flex;
}

#camera-controls > div {
    width: fit-content;
    text-align: left;
}

#picture-button {
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: none;
    background-color: rgb(216, 38, 38);
    transition: all .05s linear;
}

#picture-button:hover {
    cursor: pointer;
}

#picture-button:active {
    background-color: rgb(102, 0, 0);
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
</style>