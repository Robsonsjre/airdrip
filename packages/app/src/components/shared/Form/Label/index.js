import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Helper } from '../../../atoms'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: calc(${props => props.theme.sizes.edge} * 1);
`

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 6px 0 0;
  font-size: 10pt;
  font-weight: 700;
  color: ${props => props.theme.colors.white};
`

function Label ({ helper, children, forId, onClick }) {
  return (
    <Wrapper>
      <Title htmlFor={forId} onClick={onClick}>
        {children}
      </Title>
      {helper && <Helper value={helper} />}
    </Wrapper>
  )
}

Label.propTypes = {
  helper: PropTypes.string,
  forId: PropTypes.string,
  onClick: PropTypes.func
}

Label.defaultProps = {
  helper: null,
  forId: null,
  onClick: () => {}
}

export default Label
