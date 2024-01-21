import { reactive } from 'vue'
import { colors, defaults, qualities, supportedResolutions } from '@/constants'

export const store = reactive({
  activeEffect: defaults.effect,
  bgColor: colors[defaults.bg],
  fgColor: colors[defaults.fg],
  resolution: supportedResolutions[defaults.resolution],
  quality: qualities[defaults.quality],
  screen: 'camera',
  pauseStream: false,
  debugMode: false,
  showOrig: false,
  showEffects: false,
  showSettings: false
})
