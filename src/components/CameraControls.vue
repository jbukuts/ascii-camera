<script setup>
import { computed, ref } from 'vue'
import DropDown from '@/components/DropDown.vue'
import SimpleArrow from '@/components/SimpleArrow.vue'
import {
  colors,
  fakeCanvas,
  qualities,
  reverseColors,
  reverseQualities,
  reverseSupportedResolutions,
  supportedResolutions
} from '@/constants'
import database from '@/database'
import useCamera from '@/lib/hooks/use-camera/use-camera'
import { store } from '@/store'
import CheckBox from './CheckBox.vue'

const { cameraList, activeCamera } = useCamera()
const showControls = ref(true)

const dropDowns = computed(() => [
  {
    title: 'camera',
    display: (item) => item.camera.label,
    data: cameraList.value,
    handler: (newSelect) => {
      activeCamera.value = newSelect
    },
    default: activeCamera,
    disabled: store.pauseStream
  },
  {
    title: 'resolution',
    display: (item) => {
      const [w, h] = supportedResolutions[item]
      return `${item} (${w} x ${h})`
    },
    desc: "defines the camera's source resolution",
    data: Object.keys(supportedResolutions),
    handler: (newRes) => {
      store.resolution = supportedResolutions[newRes]
    },
    default: reverseSupportedResolutions[store.resolution.toString()],
    disabled: store.pauseStream
  },
  {
    title: 'quality',
    desc: 'defines to box size groups of pixels are sourced from',
    display: (item) => {
      const v = qualities[item]
      return `${item} (${v} x ${v})`
    },
    data: Object.keys(qualities),
    handler: (newQuality) => {
      store.quality = qualities[newQuality]
    },
    default: reverseQualities[store.quality]
  },
  {
    title: 'effect',
    data: Object.keys(store.wasmEffects),
    handler: (newEffect) => {
      store.activeEffect = newEffect
    },
    default: store.activeEffect
  },
  {
    title: 'background',
    data: Object.keys(colors),
    handler: (newBg) => {
      store.bgColor = colors[newBg]
    },
    default: reverseColors[store.bgColor.toString()]
  },
  {
    title: 'foreground',
    data: Object.keys(colors),
    handler: (newFg) => {
      store.fgColor = colors[newFg]
    },
    default: reverseColors[store.fgColor.toString()]
  }
])

const checkBoxes = computed(() => [
  {
    title: 'debug_mode',
    handler: (v) => (store.debugMode = v),
    default: store.debugMode
  },
  {
    title: 'show_orig',
    handler: (v) => (store.showOrig = v),
    default: store.showOrig
  }
])

const storePhoto = () => {
  const genImage = document.getElementById('drawn-picture').toDataURL()
  const srcImage = fakeCanvas.toDataURL()
  const settings = {
    quality: store.quality,
    effect: store.activeEffect,
    background: Array.from(store.bgColor),
    foreground: Array.from(store.fgColor),
    dateCreated: Date.now()
  }

  database.insertValue({
    srcImage,
    genImage,
    settings
  })

  console.log(settings)
}
</script>

<template>
  <div id="camera-controls-container">
    <div id="camera-controls-buttons">
      <button
        v-if="store.pauseStream"
        @click="store.pauseStream = false"
        type="button">
        discard 🗑️
      </button>
      <button
        type="button"
        :class="store.pauseStream ? 'hide' : ''"
        :disabled="store.pauseStream"
        @click="store.pauseStream = true"
        id="snap-photo"></button>
      <button v-if="store.pauseStream" @click="storePhoto" type="button">
        save 💾
      </button>
    </div>

    <div
      id="camera-controls-settings"
      :class="[{ 'control-visible': showControls }]">
      <DropDown
        v-for="item in dropDowns"
        v-bind:key="item.title"
        :step-data="item.data"
        :display="item.display"
        :handler="item.handler"
        :title="item.title"
        :description="item.desc"
        :disabled="item.disabled"
        :default="item.default"></DropDown>
      <CheckBox
        v-for="item in checkBoxes"
        v-bind:key="item.title"
        :title="item.title"
        :default="item.default"
        :handler="item.handler"></CheckBox>
    </div>

    <button
      @click="showControls = !showControls"
      id="toggle-controls-button"
      title="toggle controls">
      <SimpleArrow :dir="showControls ? 'up' : 'down'" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.hide {
  visibility: hidden;
  pointer-events: none;
}

#toggle-controls-button {
  appearance: none;
  background: transparent;
  border: none;
  margin-top: 1rem;

  &:hover {
    cursor: pointer;
  }
}

#camera-controls-container {
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.575rem;
}

#camera-controls-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  align-items: center;

  & > button {
    appearance: none;
    background-color: white;
    font-size: 1rem;
    padding: 0.65rem 0.2rem;
    color: black;
    border: 2px solid black;
    border-radius: 6px;
    height: fit-content;

    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.175);
    }
  }
}

#snap-photo {
  justify-self: center;
  grid-column-start: 2;
  width: fit-content;
  border: none !important;
  border-radius: 50% !important;
  aspect-ratio: 1 / 1;
  padding: 0.65rem !important;
  background-color: rgba(0, 0, 0, 0.75) !important;
  font-size: 1.5rem !important;
  line-height: 1;

  &:hover {
    background-color: black !important;
  }

  &::after {
    content: '📷';
    position: relative;
    bottom: 10%;
    filter: grayscale(1) contrast(0) brightness(200%);
  }
}

.control-visible {
  max-height: 1000px !important;
  // transition: max-height 1s ease-out;
}

#camera-controls-settings {
  max-height: 0;
  overflow: hidden;
  transition: max-height 1s ease-out;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  column-gap: 0.875rem;
  row-gap: 0.375rem;
  border-top: none;
}
</style>
