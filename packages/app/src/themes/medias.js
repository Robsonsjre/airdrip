import sizes from './sizes'

const medias = {
  canvas: '1280px',

  large: `@media all and (max-width: ${sizes.deviceLG}px)`,
  medium: `@media all and (max-width: ${sizes.deviceMD}px)`,
  small: `@media all and (max-width: ${sizes.deviceSM}px)`,
  micro: `@media all and (max-width: ${sizes.deviceXS}px)`,

  custom: max => `@media all and (max-width: ${max}px)`,
  customMinMax: (min, max) =>
    `@media all and (min-width: ${min}px) and (max-width: ${max}px)`
}

export default medias
