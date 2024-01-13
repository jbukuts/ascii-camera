<script setup>
const props = defineProps({
  dir: { required: false, default: 'up' }
})
</script>

<template>
  <i :class="['arrow', props.dir]"></i>
</template>

<style scoped lang="scss">
$arrow-size: 3px;

.arrow {
  border: solid black;
  border-width: 0 $arrow-size $arrow-size 0;
  display: inline-block;
  padding: $arrow-size;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
