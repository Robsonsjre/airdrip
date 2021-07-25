import _ from 'lodash'
import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import IconClose from '@material-ui/icons/CloseRounded'

const Wrapper = styled.div`
  top: 60px;
  position: absolute;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  background: ${props => props.theme.colors.white};
  box-shadow: 0 12px 48px -15px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 190px;
  transform: translateY(-20px);
  transition: opacity 100ms, transform 100ms;
  border-radius: 6px;

  &[data-active='true'] {
    pointer-events: all;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 100ms, transform 100ms;
  }
`

const Header = styled.div`
  width: 100%;
  padding: 8px;
`

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  height: 52px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.platform};
`

const Input = styled.input`
  z-index: 100;
  position: relative;
  font-size: 13pt;
  flex: 1;
  color: ${props => props.theme.colors.dark};
  font-weight: 500;
  padding: calc(${props => props.theme.sizes.edge} * 1) 8px;

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
`

const Close = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  width: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  & > svg {
    font-size: 14pt;
    color: ${props => props.theme.colors.contentMedium};
  }
  &:hover,
  &:active {
    background-color: ${props => props.theme.colors.border};
  }
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.platform};
  }
  &:last-child {
    border-bottom: none;
  }
`

const Display = styled.p`
  color: ${props => props.theme.colors.dark};
  font-size: 12pt;
  font-weight: 500;
  opacity: 1;
  margin: 0;
  padding: 0;
`

function Item ({ value, onClick }) {
  return (
    <ItemWrapper onClick={onClick}>
      <Display>{_.get(value, 'title')}</Display>
    </ItemWrapper>
  )
}

function Dropdown ({ className, source, isActive, setIsActive, onItemClick }) {
  const [searchValue, setSearchValue] = useState(null)
  const sanitizedSearchValue = useMemo(
    () => (!_.isNil(searchValue) ? _.toString(searchValue) : ''),
    [searchValue]
  )

  const filtered = useMemo(
    () =>
      source
        .map(item => {
          const title = _.toString(_.get(item, 'title')).toLowerCase()

          const weight = value => {
            const result = parseInt(
              value.indexOf(_.toString(searchValue).toLowerCase())
            )
            if (result === -1) return 0
            if (result === 0) return 1
            return result
          }

          return {
            ...item,
            weight: weight(title)
          }
        })
        .filter(item => item.weight > 0)
        .sort((a, b) => a.weight > b.weight),
    [source, searchValue]
  )

  return (
    <Wrapper
      className={className}
      data-active={isActive}
      data-component='dropdown'
    >
      <Header>
        <Search>
          <Input
            placeholder='Search ...'
            value={sanitizedSearchValue}
            onChange={e => setSearchValue(_.get(e, 'target.value'))}
          />
          <Close
            title='Clear Search'
            onClick={() => {
              if (!sanitizedSearchValue.length) setIsActive(false)
              setSearchValue(null)
            }}
          >
            <IconClose />
          </Close>
        </Search>
      </Header>
      {filtered.map(value => (
        <Item
          key={_.get(value, 'title')}
          value={value}
          onClick={() => {
            setSearchValue(null)
            onItemClick(value)
          }}
        />
      ))}
    </Wrapper>
  )
}

Item.propTypes = {
  value: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func
}

Item.defaultProps = {
  onClick: () => {}
}

Dropdown.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
  onItemClick: PropTypes.func,
  source: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string,
      icon: PropTypes.string,
      title: PropTypes.string
    })
  ),
  setIsActive: PropTypes.func
}

Dropdown.defaultProps = {
  className: null,
  isActive: false,
  onItemClick: () => {},
  setIsActive: () => {},
  source: []
}

export default Dropdown
