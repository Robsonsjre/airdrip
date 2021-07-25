import _ from 'lodash'
import React, { useState, useCallback, useMemo } from 'react'
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
  flex-grow: 0;
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

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: calc(${props => props.theme.sizes.edge} * 1 / 2);
  padding-right: calc(${props => props.theme.sizes.edge} * 1 / 2);
`
const TokenBox = styled.div`
  background-color: ${props => props.theme.colors.platform};
  margin-right: 4px;
  padding: 5px;
  border-radius: 4px;

  img {
    margin-right: 6px;
  }
`

const TokenBoxExtra = styled.div`
  position: relative;
  display: ${props => (props.value > 0 ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.platform};

  &:before{
    position: absolute;
    content: '+${props => props.value}';
    color: ${props => props.theme.colors.contentMedium};
    font-weight: 600;
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
function TokenList ({
  source: sourceInitial,
  value,
  placeholder,
  warning,
  onChange,
  maxDisplay,
  isViewOnly,
  isSymbolOnly,
  isPrimary
}) {
  const { value: list } = useToken(sourceInitial)
  const { value: selected } = useToken(value)

  const [isDropActive, setIsDropActive] = useState(false)
  const [reference] = useOnClickOutside(() => setIsDropActive(false))

  const source = useMemo(
    () =>
      _.toArray(list).map(token => ({
        ...token,
        isActive: _.toArray(selected)
          .map(s => s.symbol)
          .includes(token.symbol)
      })),
    [list, selected]
  )

  const onItemClick = useCallback(
    item => {
      setIsDropActive(false)
      const symbols = _.toArray(selected).map(s => s.symbol)
      if (!symbols.includes(item.symbol)) onChange([...symbols, item.symbol])
      else onChange(symbols.filter(symbol => symbol !== item.symbol))
    },
    [setIsDropActive, onChange, selected]
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
          {_.isNil(selected) || _.isEmpty(selected) ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            <TokenRow>
              {selected.slice(0, maxDisplay).map(item => (
                <TokenBox key={_.get(item, 'symbol')}>
                  <TokenDisplay token={item} isSelfPadded={false} />
                </TokenBox>
              ))}
              <TokenBoxExtra value={selected.length - maxDisplay} />
            </TokenRow>
          )}
        </Content>
        {!isViewOnly ? (
          <Arrow>
            <IconArrow />
          </Arrow>
        ) : (
          <Lock title={!_.isNil(selected) ? 'Token choice is locked.' : ''}>
            <IconLock />
          </Lock>
        )}
        <Highlight />
      </Box>
      <Warning value={warning} />
      {!isViewOnly && (
        <Dropdown
          source={_.toArray(source)}
          onItemClick={onItemClick}
          isActive={isDropActive}
          isSymbolOnly={isSymbolOnly}
          setIsActive={setIsDropActive}
        />
      )}
    </Wrapper>
  )
}

TokenList.propTypes = {
  source: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.arrayOf(PropTypes.string),
  isViewOnly: PropTypes.bool,
  isSymbolOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  warning: PropTypes.string,
  maxDisplay: PropTypes.number,
  onChange: () => {}
}

TokenList.defaultProps = {
  source: [],
  value: [],
  isViewOnly: false,
  isSymbolOnly: false,
  placeholder: 'Choose tokens ...',
  warning: null,
  maxDisplay: 15,
  onChange: () => {}
}

export default TokenList
