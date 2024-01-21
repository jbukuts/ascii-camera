<script setup>
import { onActivated, ref } from 'vue'
import database from '@/database'

const imageList = ref([])
const selectedPhoto = ref(0)

const selectImage = (index) => {
  selectedPhoto.value = index
}

const deleteFromLibary = (index) => {
  const id = imageList.value[index].id
  database.removeValue(id).then(() => {
    imageList.value = imageList.value.toSpliced(index, 1)
  })
}

onActivated(() => {
  database.getAll().then((list) => {
    imageList.value = list.reverse()
  })
})
</script>

<template>
  <img
    id="selected-photo"
    v-if="imageList.length > 0"
    :src="imageList[selectedPhoto].genImage" />

  <div id="image-info" v-if="imageList.length > 0">
    <p>quality: {{ imageList[selectedPhoto].settings.quality }}</p>
    <p>applied_effect: {{ imageList[selectedPhoto].settings.effect }}</p>
    <p>background_color: {{ imageList[selectedPhoto].settings.background }}</p>
    <p>foreground_color: {{ imageList[selectedPhoto].settings.foreground }}</p>
    <p>
      date_created:
      {{ imageList[selectedPhoto].settings.dateCreated || 'unknown' }}
    </p>
  </div>

  <button
    v-if="imageList.length > 0"
    @click="() => deleteFromLibary(selectedPhoto)">
    delete from library
  </button>

  <div id="image-list">
    <div
      v-for="(image, index) in imageList"
      :key="image.id"
      :class="['image-card ', { active: selectedPhoto === index }]">
      <img :src="image.genImage" @click="() => selectImage(index)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$image-width: 100px;
$corner-padding: 0.75rem;

#selected-photo {
  width: 100%;
  object-fit: contain;
  padding: 0;
}

#image-info {
  padding: 0 $corner-padding;
}

#image-list {
  margin-top: 0.75rem;
  overflow-x: auto;
  display: flex;
  align-items: center;
  // justify-content: space-around;
  flex-direction: row;
  gap: 0.575rem;
  padding: $corner-padding;
  transform: rotateX(180deg);

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar {
    border: 2px solid black;
    border-left: none;
    border-right: none;
  }

  &::-webkit-scrollbar-thumb {
    background: black;
  }
}

.image-card {
  width: $image-width;
  border: 3px solid rgba(0, 0, 0, 0.35);
  box-sizing: content-box;
  transform: rotateX(180deg);
  margin-bottom: 0;
  height: fit-content;

  & img {
    width: $image-width;
    object-fit: contain;
  }

  &:hover {
    cursor: pointer;
    border-color: black;
  }
}

.image-card.active {
  border-color: black;
}
</style>
