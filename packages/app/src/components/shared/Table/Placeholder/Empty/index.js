import _ from 'lodash'
import React, { useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Emoji } from '../../../../atoms'
import { Link } from 'react-router-dom'
import { pages } from '../../../../../constants'
import { ReactComponent as Decorator } from '../../../../../assets/decorators/oval_group_small.svg'
const FadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`

const Wrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 0;
  animation-name: ${FadeIn};
  animation-duration: 250ms;
  animation-fill-mode: ease-in-out;
  animation-delay: 1450ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  height: calc(66px * 2 + calc(${props => props.theme.sizes.edge} * 1 / 3));
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
  /* padding-left: calc(${props => props.theme.sizes.edge} * 1); */
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  color: ${props => props.theme.colors.contentMedium};
  line-height: 1.5;
  font-size: 11pt;
  font-weight: 600;
  text-align: left;

  span {
    margin-right: 10px;
    font-size: 22pt;
  }
  p {
    margin: 0;
  }
  & > * {
    z-index: 100;
  }

  &[data-single='true'] {
    height: calc(66px * 1);
  }
`

const Text = styled.div`
  b {
    color: ${props => props.theme.colors.contentMedium};
    margin: 0 4px;
    font-weight: 700;
    display: inline;
    cursor: pointer;
    svg {
      margin-bottom: -4px;
      font-size: 15pt;
    }
    &:hover,
    &:active {
      color: ${props => props.theme.colors.middle};
    }
  }
`

const RowDefault = styled(Row)``
const RowInvest = styled(Row)`
  height: 66px;
  &:after {
    content: '';
    z-index: 0;
    position: absolute;
    right: 0;
    top: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      -90deg,
      ${props => props.theme.colors.platform},
      ${props => props.theme.colors.white}
    );
    opacity: 0.5;
    transition: opacity 200ms;
  }
  &:hover,
  &:active {
    &:after {
      opacity: 1;
      transition: opacity 200ms;
    }
  }
`
const RowHedge = styled(RowInvest)``

const RowLoad = styled(RowInvest)`
  cursor: pointer;
  &:after {
    background-image: linear-gradient(
      180deg,
      ${props => props.theme.colors.platform},
      ${props => props.theme.colors.white}
    );
  }

  ${Text} {
    text-align: center;
    width: 100%;
  }
`

const Underlay = styled.div`
  position: absolute;
  z-index: 100;
  top: -32px;
  right: -32px;
  z-index: 50;

  & > svg {
    height: 256px;
    width: 256px;

    * {
      stroke: ${props => props.theme.colors.platform};
    }
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: calc(${props => props.theme.sizes.edge} * -1);
  overflow: hidden;
  height: 100%;
`

export function EmptyDefault ({
  symbol = '🤷‍♂️',
  content = 'Sometimes, you have no options...'
}) {
  return (
    <Wrapper as='div'>
      <RowDefault>
        <Emoji label='Oops' symbol={symbol} />
        <p>{content}</p>
        <Underlay>
          <Decorator />
        </Underlay>
      </RowDefault>
    </Wrapper>
  )
}

export function EmptyHistory ({
  symbol = '📜',
  content = 'Your ledger is empty. Go make history! '
}) {
  return (
    <Wrapper as='div'>
      <RowDefault>
        <Emoji label='Oops' symbol={symbol} />
        <p>{content}</p>
        <Underlay>
          <Decorator />
        </Underlay>
      </RowDefault>
    </Wrapper>
  )
}

export function EmptyInvest () {
  return (
    <Wrapper to={pages.invest.route}>
      <RowInvest>
        <Content>
          <Text>
            You have no open positions in your wallet. Pick some from the
            <b>
              <pages.invest.Icon /> Sell
            </b>
            page.
          </Text>
        </Content>
      </RowInvest>
    </Wrapper>
  )
}

export function EmptyHedge () {
  return (
    <Wrapper to={pages.hedge.route}>
      <RowHedge>
        <Content>
          <Text>
            You have no hedged positions in your wallet. Pick some from the
            <b>
              <pages.hedge.Icon /> Buy
            </b>
            page.
          </Text>
        </Content>
      </RowHedge>
    </Wrapper>
  )
}

export function EmptyPools () {
  return (
    <Wrapper to={pages.pool.route}>
      <RowHedge>
        <Content>
          <Text>
            You haven't provided liquidity yet. Pick some from the
            <b>
              <pages.pool.Icon /> Pool
            </b>
            page.
          </Text>
        </Content>
      </RowHedge>
    </Wrapper>
  )
}

export function EmptyLoad ({ onLoadMore = _.noop }) {
  const onClick = useCallback(() => _.isFunction(onLoadMore) && onLoadMore(), [
    onLoadMore
  ])

  return (
    <Wrapper as='div' onClick={onClick}>
      <RowLoad>
        <Text>Load more</Text>
      </RowLoad>
    </Wrapper>
  )
}

function Empty ({ variant }) {
  if (variant === 1) return <EmptyInvest />
  if (variant === 2) return <EmptyHedge />
  if (variant === 3) return <EmptyPools />
  if (variant === 4) return <EmptyHistory />

  return <EmptyDefault />
}

export default Empty
