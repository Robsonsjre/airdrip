import _ from 'lodash'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import IconArrow from '@material-ui/icons/KeyboardArrowDownRounded'
import IconLock from '@material-ui/icons/LockOutlined'
import { useOnClickOutside } from '../../../../../hooks'
import { Warning } from '../../../../atoms'

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

const Display = styled.p`
  color: ${props => props.theme.colors.dark};
  font-size: 12pt;
  font-weight: 500;
  opacity: 1;
  margin: 0;
  padding: 0 ${props => props.theme.sizes.edge};
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
  &[data-viewonly='white'] > ${Box} {
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
 * @param {array} props.source Array of values as source of all possible options
 * @param {string} props.value Value that has been chosen
 */
function Select ({
  source,
  value,
  placeholder,
  warning,
  onChange,
  isViewOnly,
  isPrimary
}) {
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
          {_.isNil(value) || _.isNil(value, 'title') ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            <Display>{_.get(value, 'title')}</Display>
          )}
        </Content>
        {!isViewOnly ? (
          <Arrow>
            <IconArrow />
          </Arrow>
        ) : (
          <Lock
            title={
              !_.isNil(value)
                ? `The field is locked to ${_.get(value, 'title') ||
                    'a value'}.`
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
          source={source}
          onItemClick={onItemClick}
          isActive={isDropActive}
          setIsActive={setIsDropActive}
        />
      )}
    </Wrapper>
  )
}

Select.propTypes = {
  source: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.shape({
    title: PropTypes.string.isRequired
  }),
  isViewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isSymbolOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  warning: PropTypes.string,
  onChange: () => {}
}

Select.defaultProps = {
  source: [],
  value: null,
  isViewOnly: false,
  placeholder: 'Choose ...',
  warning: null,
  onChange: () => {}
}

export default Select
