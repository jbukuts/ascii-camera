<script setup>
import { computed } from 'vue'
import { colors, qualities, reverseColors, reverseQualities } from '@/constants'
import { useCamera } from '@/lib/hooks'
import { store } from '@/store'
import { effectParams } from '@/wasm'
import CheckBox from './CheckBox.vue'
import DropDown from './DropDown.vue'

const isDev = import.meta.env.MODE === 'development'
const { cameraList, activeCamera } = useCamera()

const standardDropDowns = computed(() => [
  {
    title: 'camera',
    display: (item) => item.camera.label,
    data: cameraList.value,
    handler: (newSelect) => {
      activeCamera.value = newSelect
    },
    default: activeCamera,
    disabled: store.pauseStream
  }
  // {
  //   title: 'resolution',
  //   display: (item) => {
  //     const [w, h] = supportedResolutions[item]
  //     return `${item} (${w} x ${h})`
  //   },
  //   desc: "defines the camera's source resolution",
  //   data: Object.keys(supportedResolutions),
  //   handler: (newRes) => {
  //     store.resolution = supportedResolutions[newRes]
  //   },
  //   default: reverseSupportedResolutions[store.resolution.toString()],
  //   disabled: store.pauseStream
  // },
])

const dropDowns = computed(() =>
  [
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
    // {
    //   title: 'effect',
    //   data: Object.keys(store.wasmEffects),
    //   handler: (newEffect) => {
    //     store.activeEffect = newEffect
    //   },
    //   default: store.activeEffect
    // },
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
  ].filter(({ title }) => effectParams[store.activeEffect].has(title))
)

const checkBoxes = computed(() =>
  [
    {
      title: 'debug_mode',
      handler: (v) => (store.debugMode = v),
      default: store.debugMode,
      devOnly: true
    },
    {
      title: 'show_orig',
      handler: (v) => (store.showOrig = v),
      default: store.showOrig,
      devOnly: true
    }
  ].filter(({ devOnly = false }) => !devOnly || isDev)
)
</script>

<template>
  <div id="settings-container">
    <h3>settings</h3>
    <div id="settings-dropdowns" class="settings-grid">
      <DropDown
        v-for="item in [...standardDropDowns, ...dropDowns]"
        v-bind:key="item.title"
        :step-data="item.data"
        :display="item.display"
        :handler="item.handler"
        :title="item.title"
        :description="item.desc"
        :disabled="item.disabled"
        :default="item.default" />
    </div>
    <div id="settings-checkboxes" class="settings-grid">
      <CheckBox
        v-for="item in checkBoxes"
        v-bind:key="`${item.title}_${item.default}`"
        :title="item.title"
        :default="item.default"
        :handler="item.handler" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$gap-size: 0.5rem;

#settings-container {
  width: 100%;
  height: fit-content;
  max-height: 100%;
  background-color: rgba(255, 255, 255, 0.575);
  color: black;
  position: absolute;
  bottom: 6px;
  padding: 1.5rem 1rem;
  backdrop-filter: blur(15px);
  border-top: 3px solid black;
  z-index: 2;

  display: flex;
  flex-direction: column;
  gap: $gap-size;
  overflow-y: auto;
}

h3 {
  font-weight: bold;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: $gap-size;
}

@include apply-lesser-than('sm') {
  .settings-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
