import styled from 'styled-components'

export default styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  position: relative;
  margin-bottom: calc(${props => props.theme.sizes.edge} * 1 / 2);

  *[data-purpose='helper-wrapper'] {
    display: flex;
    align-items: center;
  }

  div[data-component='pill'] {
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 6px;
    width: auto;
    position: relative;
    background-color: ${props => props.theme.colors.white};
    padding: 6px 10px;
    border: 1px solid ${props => props.theme.colors.borderMedium};
    &:last-child {
      margin: 0;
    }

    p,
    span {
      text-align: left;
      margin: 0;
      font-size: 9pt;
      font-weight: 500;
      color: ${props => props.theme.colors.dark};
    }
    span {
      display: flex;
      align-items: center;
      font-size: 8pt;
      font-weight: 600;
      font-family: monospace;
      margin-left: 4px;
      &:empty {
        &:before {
          content: '';
          display: inline-flex;
          height: 6px;
          width: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: ${props => props.theme.colors.borderMedium};
        }
      }
    }
  }
`
