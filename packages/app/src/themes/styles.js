import { css } from 'styled-components'
import colors from './colors'

const tableParagraph = css`
  font-size: 10pt;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  margin: 0;
`

const tableParagraphSlim = css`
  font-size: 9pt;
  font-weight: 500;
  color: ${props => props.theme.colors.white};
  margin: 0;
`

const horizontalScrollContainer = css`
  & > div {
    -ms-overflow-style: none;
    scrollbar-color: transparent transparent;
    overflow-x: auto;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-thumb,
    &::-webkit-slider-thumb,
    &::-moz-scrollbar {
      display: none !important;
      height: 0 !important;
      width: 0 !important;
      background: transparent !important;
    }
  }
  & > div::-webkit-scrollbar {
    display: none !important;
    height: 0 !important;
    width: 0 !important;
    background: transparent !important;
  }
`

export const toStyles = isDark => {
  return {
    boxShadowInset:
      '1px 1px 3px -2px rgba(38, 41, 64, 0.05), inset 1px 1px 4px -1px rgba(38, 41, 64, 0.1)',
    boxShadowInsetHover:
      '3px 3px 8px -2px rgba(38, 41, 64, 0.1), inset 1px 1px 4px -1px rgba(38, 41, 64, 0)',
    boxShadowHover: '0px 5px 8px -4px rgba(38, 41, 64, 0.1)',
    tableParagraph,
    tableParagraphSlim,
    backgroundGradientLoader: `linear-gradient(-90deg,${colors.platform} 50%, ${colors.white});`,
    horizontalScrollContainer
  }
}

const styles = toStyles(false)
export default styles
