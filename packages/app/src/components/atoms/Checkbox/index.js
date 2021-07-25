import styled from 'styled-components'

const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
`

const CheckboxLabel = styled.p`
  color: ${props => props.theme.colors.dark};
  font-size: 11pt;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: left;

  a {
    color: ${props => props.theme.colors.middle};
    font-weight: 600;
  }

  margin-left: 10px;
  margin-top: -2px;
`

const CheckboxInput = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray200};
  background-color: ${props => props.theme.colors.white};
  & > svg {
    height: 14px;
    width: 14px;
    color: ${props => props.theme.colors.gray400};
  }

  &[data-value='true'] {
    border: 1px solid ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary};
    & > svg {
      visibility: visible;
      color: ${props => props.theme.colors.white};
    }
  }

  &[data-value='false'] {
    & > svg {
      visibility: hidden;
    }
    &:hover,
    &:active {
      box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.12);
    }
  }
`

const Checkbox = {
  Wrapper: CheckboxWrapper,
  Label: CheckboxLabel,
  Input: CheckboxInput
}

export default Checkbox
