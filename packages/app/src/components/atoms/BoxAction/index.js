import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const WrapperPartial = styled.div``

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.white};
  margin-right: ${props => props.theme.sizes.edge};
  border: 1px solid ${props => props.theme.colors.border};
  transition: box-shadow 250ms;
  cursor: pointer;

  & > svg {
    font-size: 16pt;
    color: ${props => props.theme.colors.contentMedium};
    transition: color 250ms;
  }
`

const Indicator = styled.div`
  display: none;
  position: absolute;
  right: 8px;
  top: 8px;
  height: 8px;
  width: 8px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${props => props.theme.gradients.primary};
`

const Wrapper = styled(WrapperPartial)`

  &:hover, &:active{
    ${Container} {
      box-shadow: ${props => props.theme.styles.boxShadowHover};
      transition: box-shadow 250ms;

      & > svg {
        color: ${props => props.theme.colors.dark};
        transition: color 250ms;
      }

    }
  }

  &[data-important='true'] {
    ${Container} > ${Indicator} {
      display: flex;
    }
  }

  ${props => props.theme.medias.medium} {
    & > ${Container}{
      box-shadow: ${props => props.theme.styles.boxShadowInset};
    }
  }



`

function BoxAction ({ children, className, Icon, isImportant, onClick }) {
  return (
    <Wrapper
      className={className}
      data-important={isImportant}
      onClick={onClick}
    >
      <Container>
        <Icon />
        {children}
        <Indicator />
      </Container>
    </Wrapper>
  )
}

BoxAction.propTypes = {
  Icon: PropTypes.any,
  isImportant: PropTypes.bool,
  onClick: PropTypes.func
}

BoxAction.defaultProps = {
  Icon: <></>,
  isImportant: false,
  onClick: () => {}
}

export default BoxAction
