import _ from 'lodash'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { rgba, lighten } from 'polished'
import { colors as _colors, gradients as _gradients } from '../../../themes'

const interpret = source => {
  const r = {}
  Object.keys(source).forEach(key => {
    r[key] = key
  })
  return r
}

const types = {
  button: {
    appearance: {
      solid: 'solid',
      outline: 'outline',
      gradient: 'gradient',
      transparent: 'transparent'
    },
    accent: {
      ...interpret(_colors),
      ...interpret(_gradients),
      whiteDark: 'whiteDark',
      whitePrimary: 'whitePrimary',
      whitePrimaryWithBorder: 'whitePrimaryWithBorder'
    },
    type: {
      button: 'button',
      external: 'external',
      router: 'router',
      next: {
        router: 'next-router'
      }
    }
  }
}

const baseSolid = (b = _colors.dark, c = _colors.white) => ({
  background: b,
  backgroundHover: lighten(0.05, b),
  appearance: types.button.appearance.solid,
  border: null,
  borderHover: null,
  color: c,
  colorHover: null,
  colorOverlay: null,
  shadow: null,
  shadowHover: null
})

const baseGradient = (b, c) => ({
  ...baseSolid(b, c),
  backgroundHover: null,
  appearance: types.button.appearance.gradient
})

const baseOutline = (b = _colors.dark, c = _colors.dark) => ({
  ...baseSolid,
  background: rgba(b, 0),
  backgroundHover: rgba(b, 0.05),
  appearance: types.button.appearance.outline,
  border: b,
  borderHover: null,
  color: c
})

export const useDesigner = (accent, appearance) => {
  const theme = useTheme()
  const { colors, gradients } = theme

  const result = useMemo(() => {
    if (appearance === types.button.appearance.solid) {
      switch (accent) {
        case types.button.accent.whiteDark:
          return {
            ...baseGradient(colors.white),
            color: colors.dark,
            backgroundHover: 'rgba(255,255,255,0.9)',
            shadow: '0 0 0 0 rgba(255,255,255,0)',
            shadowHover: '0px 0px 15px 0 rgba(255,255,255,0.3)'
          }
        default:
          if (_.has(colors, accent)) {
            return { ...baseSolid(colors[accent], colors.white) }
          }
          break
      }
    } else if (appearance === types.button.appearance.gradient) {
      switch (accent) {
        case types.button.accent.whitePrimary:
          return {
            ...baseGradient(colors.white),
            colorOverlay: gradients.primary,
            backgroundHover: 'rgba(255,255,255,0.9)',
            shadow: '0 0 0 0 rgba(0,0,0,0)',
            shadowHover: '0px 0px 15px 0 rgba(255,255,255,0.3)'
          }
        case types.button.accent.whitePrimaryWithBorder:
          return {
            ...baseGradient(colors.white),
            border: colors.middle,
            colorOverlay: gradients.primary,
            backgroundHover: 'rgba(255,255,255,0.9)',
            shadow: '0 0 0 0 rgba(0,0,0,0)',
            shadowHover: '0px 0px 15px 0 rgba(255,255,255,0.15)'
          }
        default:
          if (_.has(gradients, accent)) {
            return { ...baseGradient(), background: gradients[accent] }
          }
          break
      }
    } else if (appearance === types.button.appearance.outline) {
      switch (accent) {
        case types.button.accent.primary:
        default:
          if (_.has(colors, accent)) {
            return { ...baseOutline(colors[accent], colors[accent]) }
          }
          break
      }
    } else if (appearance === types.button.appearance.transparent) {
      switch (accent) {
        default:
          if (_.has(colors, accent)) {
            return {
              ...baseSolid(rgba(colors.dark, 0), colors[accent]),
              backgroundHover: rgba(colors.dark, 0.05)
            }
          }
          break
      }
    }

    return baseSolid()
  }, [accent, appearance, colors, gradients])

  return { ...result, accent }
}

export { types }
