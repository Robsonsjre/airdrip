import React from 'react'
import styled, { css } from 'styled-components'
import { Box } from '../../atoms'
import { Account, Persona } from '../../shared'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled(Box)`
  display: flex;
  position: absolute;
  top: 0;
  width: 100%;
  max-width: ${props => props.theme.sizes.canvasMaxWidth};
  border: 1px solid ${props => props.theme.colors.border};
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  border-top: none;
`

const Content = styled.div`
  width: 100%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  padding: ${props => props.theme.sizes.edge};
`

const Label = styled(Box)`
  display: inline-block;
  user-select: none;
  font-size: 9pt;
  font-weight: 700;
  padding: 6px 8px;

  ${({ primary }) =>
    primary
      ? css`
          background-color: ${props => props.theme.colors.primary};
        `
      : ''}
`

const Brand = styled.div`
  h1 {
    font-size: 20pt;
    margin: 12px 0 0 0;
  }
`

const Divider = styled.div`
  height: 1px;
  flex: 1;
`

function Toolbar () {
  return (
    <Wrapper>
      <Container>
        <Content>
          <Brand to='/' className='unstyled'>
            <Label primary as='div'>
              🧊&nbsp;&nbsp;Airdrip
            </Label>

            <h1 className='bold'>Campaigns</h1>
          </Brand>
          <Divider />
          <Persona />
          <Account />
        </Content>
      </Container>
    </Wrapper>
  )
}

export default Toolbar
