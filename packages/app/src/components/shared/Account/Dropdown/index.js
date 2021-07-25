import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useClipboard } from 'use-clipboard-copy'
import { rgba } from 'polished'
import { ExternalLink } from '../../../atoms'
import IconArrow from '@material-ui/icons/ArrowForwardRounded'
import IconClipboard from '@material-ui/icons/AssignmentReturnedOutlined'
import IconSuccess from '@material-ui/icons/CheckRounded'
import { useWalletModal, useAccount } from '../../../../hooks'
import { beautifyAddress } from '../../../../utils'

const Wrapper = styled.div`
  top: 64px;
  right: 0;
  position: absolute;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 100%;
  background: ${props => props.theme.colors.dark};
  box-shadow: 0 12px 48px -15px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  opacity: 0;
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateY(-20px);
  transition: opacity 100ms, transform 100ms;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.tint(20)};
  &[data-active='true'] {
    pointer-events: all;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 100ms, transform 100ms;
  }

  ${props =>
    props.theme.isDark &&
    css`
      box-shadow: 0 10px 25px -10px rgba(255, 255, 255, 0.15);
    `}
`

const ItemPartial = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: ${props => props.theme.sizes.edge};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const ItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  & > p {
    font-size: ${props => props.theme.sizes.text};
    font-weight: 600;
    color: ${props => props.theme.colors.white};
    margin: 0;
  }
  & > span {
    margin-top: 4px;
    font-size: 9pt;
    font-weight: 500;
    color: ${props => props.theme.colors.white};
    white-space: nowrap;
  }
`

const ItemAction = styled(ExternalLink)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 4px 8px 8px;
  background-color: ${props => props.theme.colors.tint(10)};
  margin-left: calc(${props => props.theme.sizes.edge} * 2);
  border-radius: 4px;
  cursor: pointer !important;
  & > p {
    margin: 0;
    font-size: 9pt;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
  }
  & > svg {
    margin-left: 4px;
    font-size: 12pt;
    color: ${props => props.theme.colors.white};
  }
  &:hover,
  &:active {
    background-color: ${props => props.theme.colors.tint(20)};
  }
`

const Item = styled(ItemPartial)`
  &[data-type='warn'] {
    ${ItemAction} {
      & > p,
      & > svg {
        color: ${props => rgba(props.theme.colors.middle, 0.9)};
      }
    }
  }
`

function Dropdown ({ isActive }) {
  const clipboard = useClipboard({ copiedTimeout: 1000 })
  const { disconnect } = useWalletModal()
  const { isConnected, address, ens } = useAccount()
  const name = useMemo(() => _.get(ens, 'value'), [ens])

  const welcome = useMemo(() => (name ? `Hi, ${name}` : 'Welcome!'), [name])

  return (
    <Wrapper data-active={isActive} data-component='dropdown'>
      {isConnected && (
        <Item>
          <ItemContent>
            <p>{welcome}</p>
            <span>{beautifyAddress(address, 8, 4)}</span>
          </ItemContent>
          {clipboard.copied ? (
            <ItemAction as='div' onClick={() => {}}>
              <p>Copied</p>
              <IconSuccess />
            </ItemAction>
          ) : (
            <ItemAction
              as='div'
              onClick={() => {
                clipboard.copy(address)
              }}
            >
              <p>Copy</p>
              <IconClipboard />
            </ItemAction>
          )}
        </Item>
      )}

      <Item>
        <ItemContent>
          <p>Learn about Pods</p>
          <span>Find out more at pods.finance</span>
        </ItemContent>
        <ItemAction to='https://pods.finance'>
          <p>Visit</p>
          <IconArrow />
        </ItemAction>
      </Item>
      {isConnected && (
        <Item>
          <ItemContent>
            <p>Log Out</p>
            <span>Disconnect your wallet</span>
          </ItemContent>
          <ItemAction
            as='div'
            onClick={() => {
              disconnect()
            }}
          >
            <p>Log Out</p>
            <IconArrow />
          </ItemAction>
        </Item>
      )}
    </Wrapper>
  )
}

Dropdown.propTypes = {
  isActive: PropTypes.bool
}

Dropdown.defaultProps = {
  isActive: false
}

export default Dropdown
