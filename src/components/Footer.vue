<template>
  <div id="footer">
    <p>
      Look at the source code <a
        target="_blank"
        href="https://github.com/jbukuts/ascii-camera"
      >here</a>
    </p>
  </div>
</template>

<script>

export default {
    name: 'Footer'
}
</script>

<style scoped>

#footer {
    width: 100%;
    height: fit-content;
    font-size: 1rem;
    text-align: center;
}

#footer a {
    color: rgb(97, 97, 97);
}

</style>