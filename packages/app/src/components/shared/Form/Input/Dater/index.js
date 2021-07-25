import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import IconLock from '@material-ui/icons/LockOutlined'
import { Warning } from '../../../../atoms'

const WrapperPartial = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: flex-start;
  align-items: flex-start;
  width: 100%;
  position: relative;
`

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 4px;
  width: 100%;
  position: relative;
  background-color: ${props => props.theme.colors.white};
  min-height: 54px;
  border-radius: 8px;
  cursor: pointer;
`

const Highlight = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 200;
  left: 0;
  top: 0;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.borderMedium};
`
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`

const Lock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 calc(${props => props.theme.sizes.edge} * 3 / 4);
  border-left: 1px solid ${props => props.theme.colors.border};
  & > svg {
    font-size: 14pt;
    color: ${props => props.theme.colors.borderMedium};
  }
`

const Display = styled.p`
  color: ${props => props.theme.colors.dark};
  font-size: 12pt;
  font-weight: 500;
  opacity: 1;
  margin: 0;
  padding: 0 ${props => props.theme.sizes.edge};
`

const Input = styled.input`
  z-index: 100;
  position: relative;
  font-size: 13pt;
  flex: 1;
  color: ${props => props.theme.colors.dark};
  font-weight: 600;
  padding: calc(${props => props.theme.sizes.edge} * 1);

  outline: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;

  min-width: 0 !important;
  width: 100%;

  &::placeholder {
    -webkit-appearance: none;
    color: ${props => props.theme.colors.content};
    font-size: 12pt;
    font-weight: 500;
    opacity: 1;
  }

  &:focus {
    & ~ ${Highlight} {
      border: 1px solid ${props => props.theme.colors.contentMedium};
    }
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-primary='false'] > ${Box} {
    background-color: transparent;

    ${Highlight} {
      border: 1px solid ${props => props.theme.colors.borderMedium};
    }
  }
  &[data-viewonly='true'] > ${Box} {
    background-color: transparent;
    cursor: default;
  }
  &[data-viewonly='white'] > ${Box} {
    cursor: default;
  }
`

/**
 *
 * @param {object} props
 * @param {array} props.source Array of values as source of all possible options
 * @param {string} props.value Value in seconds (UNIX)
 */
function Dater ({
  value,
  placeholder,
  warning,
  onChange,
  isViewOnly,
  isPrimary
}) {
  return (
    <Wrapper data-primary={isPrimary} data-viewonly={isViewOnly}>
      <Box>
        <Content>
          {isViewOnly ? (
            <Display>{value}</Display>
          ) : (
            <Input
              placeholder={placeholder}
              type='date'
              value={value || ''}
              onChange={e => {
                onChange(e)
              }}
            />
          )}
          <Highlight />
        </Content>
        {isViewOnly && (
          <Lock
            title={
              !_.isNil(value)
                ? `The field is locked to ${value || 'a value'}.`
                : ''
            }
          >
            <IconLock />
          </Lock>
        )}
      </Box>
      <Warning value={warning} />
    </Wrapper>
  )
}

Dater.propTypes = {
  value: PropTypes.string,
  isViewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isSymbolOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  warning: PropTypes.string,
  onChange: () => {}
}

Dater.defaultProps = {
  value: null,
  isViewOnly: false,
  placeholder: 'Choose ...',
  warning: null,
  onChange: () => {}
}

export default Dater
