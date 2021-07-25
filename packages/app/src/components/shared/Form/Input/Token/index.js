import _ from 'lodash'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import IconArrow from '@material-ui/icons/KeyboardArrowDownRounded'
import IconLock from '@material-ui/icons/LockOutlined'
import { useToken, useOnClickOutside } from '../../../../../hooks'
import { TokenDisplay, Warning } from '../../../../atoms'

import Dropdown from './Dropdown'

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

const Arrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 calc(${props => props.theme.sizes.edge} * 3 / 4);
  border-left: 1px solid ${props => props.theme.colors.border};
  & > svg {
    font-size: 14pt;
    color: ${props => props.theme.colors.dark};
  }
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

const Placeholder = styled.p`
  color: ${props => props.theme.colors.content};
  font-size: 12pt;
  font-weight: 500;
  opacity: 1;
  margin: 0;
  padding: 0 ${props => props.theme.sizes.edge};
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

  &[data-active='true'] > ${Box} {
    ${Highlight} {
      border: 1px solid ${props => props.theme.colors.contentMedium};
    }
  }
`

/**
 *
 * @param {object} props
 * @param {array} props.source Array of token keys based on constants.tokens.keys[]
 * @param {string} props.value Key of the token that has been chosen
 */
function Token ({
  source,
  value,
  placeholder,
  warning,
  onChange,
  isViewOnly,
  isSymbolOnly,
  isPrimary
}) {
  const { value: list } = useToken(source)
  const { value: selected } = useToken(value)

  const [isDropActive, setIsDropActive] = useState(false)
  const [reference] = useOnClickOutside(() => setIsDropActive(false))

  const onItemClick = useCallback(
    item => {
      setIsDropActive(false)
      onChange(item)
    },
    [setIsDropActive, onChange]
  )

  return (
    <Wrapper
      data-primary={isPrimary}
      data-viewonly={isViewOnly}
      data-active={isDropActive}
      ref={reference}
    >
      <Box onClick={() => setIsDropActive(prev => !prev)}>
        <Content>
          <TokenDisplay token={selected} />
          {(_.isNil(selected) || _.isNil(selected, 'symbol')) && (
            <Placeholder>{placeholder}</Placeholder>
          )}
        </Content>
        {!isViewOnly ? (
          <Arrow>
            <IconArrow />
          </Arrow>
        ) : (
          <Lock
            title={
              !_.isNil(selected)
                ? `Token choice is locked to ${_.get(selected, 'symbol')}`
                : ''
            }
          >
            <IconLock />
          </Lock>
        )}
        <Highlight />
      </Box>
      <Warning value={warning} />
      {!isViewOnly && (
        <Dropdown
          source={list}
          onItemClick={onItemClick}
          isActive={isDropActive}
          isSymbolOnly={isSymbolOnly}
          setIsActive={setIsDropActive}
        />
      )}
    </Wrapper>
  )
}

Token.propTypes = {
  source: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  isViewOnly: PropTypes.bool,
  isSymbolOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  warning: PropTypes.string,
  onChange: () => {}
}

Token.defaultProps = {
  source: [],
  value: null,
  isViewOnly: false,
  isSymbolOnly: false,
  placeholder: 'Choose token ...',
  warning: null,
  onChange: () => {}
}

export default Token
