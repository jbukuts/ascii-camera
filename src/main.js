import '#styles/main.scss'
import 'rvfc-polyfill'
// import '#pinch/dist/style.css'

import { createApp } from 'vue'
import App from '@/App.vue'
// import PinchScrollZoom from '#pinch'
const app = createApp(App)
// app.component('pinch-zoom', PinchScrollZoom)

app.mount('#app')
