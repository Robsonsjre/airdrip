import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  min-height: 16px;
  margin-top: 2px;
  overflow: hidden;
  &[data-centered='true'] {
    width: 100%;
    text-align: center !important;
    & > p {
      text-align: center !important;
    }
  }
`

const Text = styled.p`
  margin: 0;
  font-size: 9pt;
  font-weight: 600;
  text-align: left;
  color: ${props => props.theme.colors.red};
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 250ms, transform 250ms;
  &[data-visible='true'] {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 250ms, transform 250ms;
  }
`

function Warning ({ className, value, isCentered }) {
  return (
    <Wrapper className={className} data-centered={isCentered}>
      <Text data-visible={!_.isNil(value) && _.isString(value)}>{value}</Text>
    </Wrapper>
  )
}

Warning.propTypes = {
  value: PropTypes.string,
  isCentered: PropTypes.bool
}
Warning.defaultProps = {
  isCentered: false,
  value: null
}

export default Warning
