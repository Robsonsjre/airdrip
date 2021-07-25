import _ from 'lodash'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useToken } from '../../../../../hooks'
import {
  TokenDisplay,
  TokenMultiDisplay,
  Warning,
  Spinner
} from '../../../../atoms'

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
  border-radius: 8px;
  width: 100%;
  position: relative;
  background-color: ${props => props.theme.colors.tint(10)};
  min-height: 54px;
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
  border: 1px solid ${props => props.theme.colors.tint(30)};
  overflow: hidden;

  &:before {
    content: '';
    left: 0;
    bottom: 0;
    height: 8px;
    width: 8px;
    z-index: 10;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    border-top-right-radius: 6px;
    background-color: ${props => props.theme.colors.tint(30)};
  }
`

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 200;
  height: 30px;
  width: 30px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.white};
  margin-right: 6px;
  &[data-neighbour-right='true'] {
    margin-right: -8px;
  }
`

const Input = styled.input`
  z-index: 100;
  position: relative;
  font-size: 12pt;
  flex: 1;
  color: ${props => props.theme.colors.white};
  font-weight: 500;
  padding: calc(${props => props.theme.sizes.edge} * 1);

  outline: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;

  min-width: 0 !important;
  width: 100%;

  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &::placeholder {
    -webkit-appearance: none;
    color: ${props => props.theme.colors.tint(50)};
    font-size: 12pt;
    font-weight: 500;
    opacity: 1;
  }

  &:focus {
    & ~ ${Highlight} {
      border: 1px solid ${props => props.theme.colors.white};
    }
  }
`

const Display = styled.p`
  z-index: 100;
  position: relative;
  font-size: 12pt;
  flex: 1;
  color: ${props => props.theme.colors.white};
  font-weight: 500;
  padding: calc(${props => props.theme.sizes.edge} * 1);
  margin: 0;
  &:empty {
    &:after{
      content: "${props => props.placeholder}";
      color: ${props => props.theme.colors.content};
      font-size: 12pt;
      font-weight: 500;
      opacity: 1;
    }
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-primary='false'] > ${Box} {
    background-color: ${props => props.theme.colors.tint('05')};

    ${Highlight} {
      border: 1px solid ${props => props.theme.colors.tint(10)};
    }

    ${Input} {
      pointer-events: none;
      &:focus {
        & ~ ${Highlight} {
          border: 1px solid ${props => props.theme.colors.tint(10)};
        }
      }
    }
  }

  &[data-primary='false'][data-viewonly='false'] {
    & > ${Box} > ${Highlight} {
      &:before {
        opacity: 0.5;
        transition: opacity 150ms;
      }
    }
  }

  ${props => props.theme.medias.medium} {
    ${Input}, ${Display} {
      padding: calc(${props => props.theme.sizes.edge} * 1)
        calc(${props => props.theme.sizes.edge} * 1 / 2);
    }
  }
`

function Text ({
  id,
  placeholder,
  token,
  value,
  warning,
  onChange,
  onClick,
  isPrimary,
  isViewOnly,
  isLoading
}) {
  const { value: requested } = useToken(token)
  const sanitized = useMemo(() => (!_.isNil(value) ? _.toString(value) : ''), [
    value
  ])
  const reference = useRef()

  return (
    <Wrapper
      data-primary={isPrimary}
      data-viewonly={isViewOnly}
      onClick={e => {
        onClick(e)
        if (!isViewOnly && !_.isNil(reference) && !_.isNil(reference.current)) {
          reference.current.focus()
        }
      }}
    >
      <Box>
        {!isViewOnly ? (
          <Input
            id={id}
            ref={reference}
            placeholder={placeholder}
            value={sanitized}
            onChange={e => {
              onChange(e)
            }}
          />
        ) : (
          <Display placeholder={placeholder}>{sanitized}</Display>
        )}
        {isLoading && (
          <Loader data-neighbour-right={!_.isNil(requested)}>
            <Spinner color={c => c.content} size={20} />
          </Loader>
        )}
        {!_.isNil(requested) &&
          (_.isArray(requested) ? (
            <TokenMultiDisplay tokens={requested} />
          ) : (
            <TokenDisplay token={requested} />
          ))}

        <Highlight />
      </Box>
      <Warning value={warning} />
    </Wrapper>
  )
}

Text.propTypes = {
  id: PropTypes.string,
  token: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLabel: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  isPrimary: PropTypes.bool,
  isViewOnly: PropTypes.bool,
  isLoading: PropTypes.bool,
  warning: PropTypes.string
}

Text.defaultProps = {
  id: null,
  token: null,
  max: null,
  maxLabel: 'Max',
  value: null,
  placeholder: '...',
  onChange: () => {},
  onClick: () => {},
  isPrimary: false,
  isViewOnly: false,
  isLoading: false,
  warning: null
}

export default Text
