<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  handler: { type: Function, required: true },
  default: { type: Boolean, required: false, default: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  disabled: { type: Boolean, required: false, default: false },
  orientation: {
    type: String,
    required: false,
    default: 'horizontal'
  }
})

const checked = ref(props.default)

const checkBoxName = `${props.title}_checkbox`

watch(checked, props.handler)
</script>

<template>
  <div :class="['checkbox-wrapper', props.orientation]">
    <label :for="checkBoxName" class="checkbox-label">{{ title }}</label>
    <input
      :disabled="props.disabled"
      :name="checkBoxName"
      :id="checkBoxName"
      type="checkbox"
      :checked="checked"
      @change="checked = !checked" />
  </div>
</template>

<style scoped lang="scss">
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
}

.checkbox-wrapper.horizontal {
  flex-direction: row;
  gap: 0.25rem;
}

.checkbox-wrapper.vertical {
  flex-direction: column;
  gap: 0.15rem;
}

.checkbox-label {
  font-size: small;
}

input[type='checkbox'] {
  // appearance: none;
}
</style>
