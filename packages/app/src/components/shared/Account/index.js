import _ from 'lodash'
import React, { useMemo, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'
import IconSettings from '@material-ui/icons/SettingsRounded'
import IconWallet from '@material-ui/icons/AccountBalanceWalletRounded'
import { useAccount, useWalletModal, useOnClickOutside } from '../../../hooks'
import { networks } from '../../../constants'
import { shortenAddress } from '../../../utils'
import Dropdown from './Dropdown'
const WrapperPartial = styled.div`
  position: relative;
`

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: auto;
  height: 56px;
  min-width: 206px;
  border-radius: ${props => props.theme.sizes.baseRadius};
  padding-left: calc(${props => props.theme.sizes.edge} * 1);
  padding-right: calc(${props => props.theme.sizes.edge} * 1 / 2);
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-right: ${props => props.theme.sizes.edge};
  flex: 1;
`

const Title = styled.p`
  margin: 0 0 4px 0;
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

const Address = styled.div`
  display: flex;
  font-size: 8pt;
  color: ${props => props.theme.colors.white};
  font-weight: 600;
  & > p {
    margin: 0;
  }
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: ${props => props.theme.sizes.baseRadius};
  border: 1px solid ${props => props.theme.colors.primary};
  transform: rotate(0deg);
  transition: transform 250ms;
  & > svg {
    color: ${props => props.theme.colors.content};
    font-size: 14pt;
    transition: color 250ms;
  }
`

const ConnectWarning = styled.p`
  font-size: 11pt;
  font-weight: 600;
  margin: 0;
  background: ${props => props.theme.colors.white};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Wrapper = styled(WrapperPartial)`
  &:hover,
  &:active {
    ${Box} {
      transition: box-shadow 250ms;
    }
    &[data-connected='true'] {
      ${Icon} {
        transform: rotate(5deg);
        transition: transform 250ms;
        & > svg {
          color: ${props => props.theme.colors.primary};
          transition: color 250ms;
        }
      }
    }
    &[data-connected='false'] {
      ${Icon} {
        & > svg {
          color: ${props => props.theme.colors.primary};
          transition: color 250ms;
        }
      }
    }
  }

  &[data-connected='false'] {
    ${Icon} > svg {
      color: ${props => props.theme.colors.contentLight};
    }
  }

  &[data-configured='false'] {
    & > ${Box} {
      &:after {
        opacity: 1;
        pointer-events: all;
        transition: 150ms 200ms;
      }
    }
  }

  &[data-discovering='true'] {
    ${Main} {
      opacity: 0;
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
      ${Icon} {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background-color: ${props => props.theme.colors.white};
        border: 1px solid ${props => props.theme.colors.border};
      }
    }

    &[data-connected='false'] {
      ${Icon} {
        & > svg {
          color: ${props => props.theme.colors.primary} !important;
        }
      }
    }
  }
`

function Content ({ ens, address, networkId, isConnected }) {
  const name = useMemo(() => _.get(ens, 'value'), [ens])
  const net = useMemo(() => {
    if (networkId === networks.mainnet) return null
    if (Object.values(networks).includes(networkId)) {
      return _.get(networks._data[networkId], 'name')
    }
    return 'Mistery'
  }, [networkId])

  return isConnected ? (
    <>
      <Title>
        {name ? `Hi, ${name}` : 'Welcome!'}
        {net && <span>{net}</span>}
      </Title>
      <Address>
        <p>{shortenAddress(address, 10, 6)}</p>
      </Address>
    </>
  ) : (
    <>
      <ConnectWarning>Connect wallet</ConnectWarning>
    </>
  )
}

function Account () {
  const { connect } = useWalletModal()
  const data = useAccount()
  const [isDropActive, setIsDropActive] = useState(false)
  const [reference] = useOnClickOutside(() => setIsDropActive(false))

  const { isConnected, isExpected } = useMemo(() => data, [data])

  const onClick = useCallback(() => {
    if (isConnected) setIsDropActive(prev => !prev)
    else {
      connect()
    }
  }, [isConnected, connect, setIsDropActive])

  return (
    <Wrapper
      data-connected={isConnected}
      ref={reference}
      data-discovering={isExpected && !isConnected}
    >
      <Box onClick={onClick}>
        <Main>
          <Content {...data} />
        </Main>
        <Icon>{isConnected ? <IconSettings /> : <IconWallet />}</Icon>
      </Box>
      <Dropdown isActive={isDropActive} />
    </Wrapper>
  )
}

Account.propTypes = {}

Account.defaultProps = {}

export default Account
