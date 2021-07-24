import React from 'react'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'

const WrapperPartial = styled.div`
  position: relative;
  margin-right: ${props => props.theme.sizes.edge};
`

const Box = styled.div`
  display: grid;
  position: relative;
  width: auto;
  height: 56px;
  border-radius: ${props => props.theme.sizes.baseRadius};
  padding: calc(${props => props.theme.sizes.edge} * 1 / 2);
  background-color: ${props => props.theme.colors.tint('05')};
  border: 1px solid ${props => props.theme.colors.border};
  transition: box-shadow 250ms;
  cursor: pointer;
  overflow: hidden;

  & > svg {
    font-size: 18pt;
    color: ${props => props.theme.colors.primary};
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: 150ms;
  }
`

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: calc(${props => props.theme.sizes.edge} * 1 / 2);
  flex: 1;
`

const Item = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: center;
  padding: 0 14px;
  height: 100%;
  flex: 1;
  border-radius: 2px;

  &[data-active='true'] {
    background-color: ${props => props.theme.colors.primary};
  }
  &:not([data-active='true']) {
    &:hover,
    &:active {
      background-color: ${props => props.theme.colors.tint('10')};
    }
  }
`

const Title = styled.p`
  margin: 0;
  font-size: 11pt;
  color: ${props => props.theme.colors.white};
  font-weight: 600;
  max-width: 130px;
  ${props => props.theme.extensions.ellipsis};

  & > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9pt;
    height: 16px;
    padding: 0 4px;
    border-radius: 2px;
    margin-left: 4px;
    text-align: center;
    background-color: ${props => rgba(props.theme.colors.primary, 0.1)};
    border: 1px solid ${props => rgba(props.theme.colors.primary, 0.9)};
    color: ${props => rgba(props.theme.colors.primary, 0.9)};

    ${props =>
      props.theme.isDark &&
      css`
        background-color: ${props => rgba(props.theme.colors.primary, 0.9)};
        color: ${props => props.theme.colors.white};
      `}
  }
`

const Wrapper = styled(WrapperPartial)`
  &:hover,
  &:active {
    ${Box} {
      transition: box-shadow 250ms;
    }
  }

  ${props => props.theme.medias.medium} {
    ${Box} {
      padding: 0;
      border: 0;
      min-width: 0;
      height: auto;

      ${Main} {
        display: none;
      }
    }
  }
`

function Persona () {
  return (
    <Wrapper>
      <Box>
        <Main>
          <Item data-active='true'>
            <Title>DAO</Title>
          </Item>
          <Item>
            <Title>Recipient</Title>
          </Item>
        </Main>
      </Box>
    </Wrapper>
  )
}

Persona.propTypes = {}

Persona.defaultProps = {}

export default Persona
