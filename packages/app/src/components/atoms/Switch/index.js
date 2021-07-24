import styled from 'styled-components'
const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const SwitchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @supports (-webkit-appearance: none) or (-moz-appearance: none) {
    input[type='checkbox'] {
      --active: ${props => props.theme.colors.middle};
      --active-inner: #fff;
      --focus: 2px rgba(39, 94, 254, 0.3);
      --border: #bbc1e1;
      --border-hover: #a6aed8;
      --background: #fff;
      --disabled: #f6f8ff;
      --disabled-inner: #e1e6f9;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 28px;
      flex-shrink: 0;
      outline: none;
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin: 0;
      cursor: pointer;
      border: 1px solid var(--bc, var(--border));
      background: var(--b, var(--background));
      transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
      &:after {
        content: '';
        display: block;
        left: 0;
        top: 0;
        position: absolute;
        transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
          opacity var(--d-o, 0.2s);
      }
      &:checked {
        --b: var(--active);
        --bc: var(--active);
        --d-o: 0.3s;
        --d-t: 0.6s;
        --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
      }
      &:disabled {
        --b: var(--disabled);
        cursor: not-allowed;
        opacity: 0.9;
        &:checked {
          --b: var(--disabled-inner);
          --bc: var(--border);
        }
        & + label {
          cursor: not-allowed;
        }
      }
      &:hover {
        &:not(:checked) {
          &:not(:disabled) {
            --bc: var(--border-hover);
          }
        }
      }
      &:focus {
        box-shadow: 0 0 0 var(--focus);
      }

      & + label {
        line-height: 21px;
        cursor: pointer;
      }
    }
    input[type='checkbox'] {
      width: 52px;
      border-radius: 14px;
      &:after {
        left: 2px;
        top: 2px;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        background: var(--ab, var(--border));
        transform: translateX(var(--x, 0));
      }
      &:checked {
        --ab: var(--active-inner);
        --x: 24px;
      }
      &:disabled {
        &:not(:checked) {
          &:after {
            opacity: 0.6;
          }
        }
      }
    }
  }
`

const SwitchInput = styled.input``

const SwitchLabel = styled.p`
  color: ${props => props.theme.colors.dark};
  font-size: 10pt;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 10px;
  text-align: left;

  a {
    color: ${props => props.theme.colors.middle};
    font-weight: 600;
  }
`

const Switch = {
  Box: SwitchBox,
  Input: SwitchInput,
  Label: SwitchLabel,
  Wrapper: SwitchWrapper
}

export default Switch
