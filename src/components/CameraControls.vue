<script setup>
import { fakeCanvas } from '@/constants'
import database from '@/database'
import { store } from '@/store'

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
  <div id="camera-controls-buttons">
    <div class="column">
      <button
        @click="() => (store.showEffects = !store.showEffects)"
        type="button">
        {{ `${store.showEffects ? 'hide' : 'show'} effects` }}
      </button>
      <button
        @click="() => (store.showSettings = !store.showSettings)"
        type="button">
        {{ `${store.showSettings ? 'hide' : 'show'} settings` }}
      </button>
    </div>

    <button
      type="button"
      :class="store.pauseStream ? 'hide' : ''"
      :disabled="store.pauseStream"
      @click="store.pauseStream = true"
      id="snap-photo"></button>

    <div class="column" v-if="store.pauseStream">
      <button @click="storePhoto" type="button">save</button>
      <button @click="store.pauseStream = false" type="button">discard</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#camera-controls-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 1.75rem 1rem;

  & .column {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  & button {
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
</style>
