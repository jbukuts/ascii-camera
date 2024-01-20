<script setup>
import { onMounted, ref } from 'vue'
import AsciiHeader from '@/components/AsciiHeader.vue'
import CameraControls from '@/components/CameraControls.vue'
import CameraView from '@/components/CameraView.vue'
import LibraryView from '@/components/LibraryView.vue'
import { store } from '@/store'
import AboutView from './components/AboutView.vue'

const cameraReady = ref(false)

const tabs = {
  camera: CameraView,
  upload: '',
  libary: LibraryView,
  about: AboutView
}

onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(() => {
      cameraReady.value = true
    })
})
</script>

<template>
  <AsciiHeader />
  <div v-if="cameraReady" id="main-container">
    <div id="display-pane">
      <div id="tab-controls">
        <button
          v-for="tab in Object.keys(tabs)"
          :key="tab"
          :class="['tab-button', { active: store.screen === tab }]"
          @click="store.screen = tab">
          {{ tab }}
        </button>
      </div>
      <hr />
    </div>
    <KeepAlive><component :is="tabs[store.screen]"></component></KeepAlive>
    <CameraControls v-if="cameraReady && store.screen === 'camera'" />
  </div>
  <p><small>@jbukuts 2024</small></p>
</template>

<style scoped lang="scss">
$main-border-size: 3px;

#main-container {
  border: $main-border-size solid black;
}

#display-pane {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.25rem;
  padding: 0.275rem 0.275rem;
  border-bottom: $main-border-size solid black;

  & > hr {
    flex-grow: 1;
    border-top: thick double black;
    border-bottom: 2px solid black;
    padding: 1px;
  }
}

.tab-button {
  border: 2px solid transparent;
  background-color: white;
  outline: none;
  font-size: small;
  padding: 3px 5px;

  &:hover {
    border-color: black;
    cursor: pointer;
  }
}

.tab-button.active {
  background-color: rgb(0, 0, 0);
  color: white;
  font-weight: bold;
}
</style>
