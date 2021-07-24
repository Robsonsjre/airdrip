const colors = {
  primary: '#6F47EE',
  secondary: '#DF1D2C',
  middle: '#C41857',
  white: '#ffffff',
  black: '#000000',
  dark: '#0E042F',
  night: '#20212A',

  danger: '#FF1744',

  transparent: 'transparent',

  blue: '#2979FF',
  blueSuite: '#04BEFE',
  blueFaded: '#03A0DC',
  purple: '#7F00FF',
  pink: '#E100FF',
  red: '#F44336',
  green: '#4CAF50',
  green2: '#18cc72',
  yellow: '#FFEB3B',
  yellow2: '#FFC83B',
  orange: '#FF9800',

  google: '#E13F2A'
}

export const gradients = {
  primary: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
  primaryBuilder: (angle = 0) =>
    `linear-gradient(${angle}deg, ${colors.primary}, ${colors.secondary})`,
  white: `linear-gradient(25deg, ${colors.white} 30%, ${colors.white})`,
  transparentBuilder: (start = '#ffffff', angle = 0) =>
    `linear-gradient(${angle}deg, ${start}, ${colors.transparent})`
}

export default colors
