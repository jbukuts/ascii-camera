<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  stepData: { type: Array, required: true },
  handler: { type: Function, required: true },
  display: { type: Function, required: false },
  default: { required: false },
  title: { required: true },
  description: { type: String, required: false },
  disabled: { type: Boolean, required: false, default: false }
})

const selected = ref(props.default || null)

const dropDownName = `select_${props.title}`

watch(selected, props.handler)
</script>

<template>
  <div class="dropdown-wrapper">
    <label
      :class="['dropdown-label', { tooltip: !!props.description }]"
      :for="dropDownName"
      :title="description"
      >{{ props.title }}</label
    >
    <select
      class="dropdown-select"
      :name="dropDownName"
      :id="dropDownName"
      v-model="selected"
      :disabled="props.disabled">
      <option v-for="item in props.stepData" :value="item" :key="item">
        {{ props.display ? props.display(item) : item }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dropdown-label {
  font-size: small;
  display: flex;
  align-items: center;
}

.dropdown-label.tooltip {
  &::after {
    content: '?';
    height: fit-content;
    font-size: 75%;
    margin-left: 0.25rem;
    background-color: gray;
    color: white;
    padding: 0.05rem 0.3rem;
    // border-radius: 50%;
    opacity: 0.5;
    transition: opacity 0.1s linear;
    border-radius: 2px;
  }

  &:hover::after {
    opacity: 1;
  }
}

.dropdown-select {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid black;
  padding: 0.15rem 0.25rem;

  cursor: pointer;

  &::after {
    content: 'dfsdf';
    background-color: red;
    color: blue;
  }
}
</style>
