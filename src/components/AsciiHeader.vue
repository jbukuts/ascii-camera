<template>
  <header>
    <pre>
   _      _                     _         _         _             _   _
  (_)___-| | _ ___ ____    ___ | |_  ___ | |____   | |_  ___ ___ | | | |_
  | / _  | |/ / -_( -_ /  |  _ \   \/ _ |   | _ \  | _ \/ _ \ _ |   ||   \
 _/ \__/_|_|\_\___/___')  |  _ /_|_|\___/|_|\___/  |___/\___/___/|_| |_|_|
|__/                      |_|  </pre
    >
  </header>
</template>

<style scoped lang="scss">
header {
  line-height: 1.45;
  color: black;
  font-weight: bolder;
  margin-bottom: 0.25rem;
}

pre {
  font-size: min(10px, 2vw);
}

@media (max-width: $app-width) {
  pre {
    display: none;
  }
}
</style>
