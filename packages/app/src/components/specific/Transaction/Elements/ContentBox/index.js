import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Loader from '../SupportLoader'

const Wrapper = styled.div`
  width: 100%;
  position: relatve;
  border-radius: 4px;
  padding-top: ${props => props.theme.sizes.edge};
  padding-bottom: ${props => props.theme.sizes.edge};
  background: ${props => props.theme.colors.tint('05')};
  border: 1px solid ${props => props.theme.colors.tint(10)};
  &[data-active='true'] {
    display: block;
  }
  &[data-active='false'] {
    display: none;
  }
`

function ContentBox ({ children }) {
  return (
    <Wrapper data-active>
      <Loader isActive={false} />
      {children}
    </Wrapper>
  )
}

ContentBox.propTypes = {
  force: PropTypes.bool,
  isLoading: PropTypes.bool
}

ContentBox.defaultProps = {
  force: false,
  isLoading: true
}

export default ContentBox
