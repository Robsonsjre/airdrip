import React from 'react'
import {
  ThemeProvider as Provider,
  createGlobalStyle,
  css
} from 'styled-components'
import colors, { gradients } from './colors'
import extensions from './extensions'
import constants from './constants'
import styles from './styles'
import medias from './medias'
import sizes from './sizes'

export const background = {
  primary:
    'linear-gradient(68.11deg, #0E042F 1.98%, #100533 87.75%, #0E042F 100%)'
}

const CommonStyle = css`
  @font-face {
    font-family: 'Metropolis';
    font-style: normal;
    font-weight: 500;
    src: url('./fonts/Metropolis-Regular.woff2') format('woff2'),
      url('./fonts/Metropolis-Regular.woff') format('woff');
  }

  @font-face {
    font-family: 'Metropolis';
    font-style: normal;
    font-weight: 700;
    src: url('./fonts/Metropolis-Bold.woff2') format('woff2'),
      url('./fonts/Metropolis-Bold.woff') format('woff');
  }

  @font-face {
    font-family: 'Metropolis';
    font-style: normal;
    font-weight: 300;
    src: url('./fonts/Metropolis-Thin.woff2') format('woff2'),
      url('./fonts/Metropolis-Thin.woff') format('woff');
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    padding: 0rem;
    margin: 0rem;
    overflow-x: hidden;
    overflow-y: hidden;
    font-family: Metropolis,
      '-apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, Arial, sans-serif';
    color: white;
    font-weight: 500;
    font-size: 16px;
    overscroll-behavior: none;
    background-color: ${props => props.theme.colors.dark};
  }

  html {
    color: ${colors.dark};
    cursor: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow-y: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    appearance: none;
    border: none;
    font-family: inherit;
    outline: none;
  }

  @keyframes autofill {
    to {
      background-color: ${colors.white};
    }
  }

  input[type='number']:-webkit-inner-spin-button,
  input[type='number']:-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
  }
  input:-webkit-autofill {
    animation-fill-mode: both;
    animation-name: autofill;
  }

  #WEB3_CONNECT_MODAL_ID > div {
    z-index: 99999;
  }
`

const GlobalStyle = createGlobalStyle`
  ${CommonStyle}
`

function ThemeProvider ({ children }) {
  return (
    <Provider
      theme={{
        colors,
        constants,
        gradients,
        extensions,
        medias,
        sizes,
        styles
      }}
    >
      {children}
    </Provider>
  )
}

const Theme = {
  colors,
  constants,
  gradients,
  medias,
  sizes,
  styles,
  extensions,
  GlobalStyle,
  Provider: ThemeProvider
}
export {
  colors,
  constants,
  gradients,
  medias,
  sizes,
  styles,
  extensions,
  GlobalStyle,
  ThemeProvider as Provider
}
export default Theme
