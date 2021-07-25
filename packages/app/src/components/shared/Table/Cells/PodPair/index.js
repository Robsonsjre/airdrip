import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import { useToken } from '../../../../../hooks'

const WrapperPartial = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: calc(${props => props.theme.sizes.edge} * 1 / 2);
`

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 52px;
  border-radius: 6px;
  padding: 0 calc(${props => props.theme.sizes.edge} * 1 / 2);
  background-color: ${props => props.theme.colors.tint(10)};
  border: 1px solid ${props => props.theme.colors.border};

  overflow: hidden;
  max-width: 220px;
`

const Icon = styled.img`
  height: 28px;
  width: 28px;
  object-fit: contain;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${props => props.theme.colors.platform};
  &[src=''],
  &:not([src]) {
    opacity: 0;
  }
`

const Content = styled.div`
  flex: 1;
  text-align: center;
`

const Title = styled.p`
  ${props => props.theme.styles.tableParagraph};
`

const Indicator = styled.div`
  position: relative;
  height: 100%;
  width: ${props => props.theme.sizes.edge};
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 6px;
  & > * {
    margin-left: -14px;
    &:first-child {
      margin-left: 0;
      z-index: 10;
    }
    &:nth-child(2) {
      z-index: 9;
    }
    &:nth-child(3) {
      z-index: 8;
    }
    &:nth-child(4) {
      z-index: 7;
    }
    &:nth-child(5) {
      z-index: 6;
    }
  }
`

const Wrapper = styled(WrapperPartial)`
&[data-theme="${Theme.constants.table.theme.slim}"]{
  padding-right: 0;
  ${Box}{
    padding: 0;
    background-color: ${props => props.theme.colors.transparent};
    border: none;
    ${Content}{
      flex: none;
    }
  }

  ${Icons}{
    & > ${Icon}{
      height: 20px;
      width: 20px;
    }
  }
  ${Title}{
    margin-left: -6px;
    ${props => props.theme.styles.tableParagraphSlim};
  }
  ${Indicator}{
    display: none;
  }
}
`

function PodPair ({ data, column, theme }) {
  const { value } = useMemo(() => data, [data])
  const { value: tokens } = useToken(value)
  return (
    <Wrapper
      size={_.get(column, 'weight')}
      data-theme={theme}
      data-component='pod-pair'
    >
      <Box>
        <Icons>
          {tokens.map(t => (
            <Icon key={_.get(t, 'symbol')} src={_.get(t, 'icon')} />
          ))}
        </Icons>
        <Content>
          <Title>{tokens.map(t => _.get(t, 'symbol')).join(':')}</Title>
        </Content>
        <Indicator />
      </Box>
    </Wrapper>
  )
}

PodPair.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired
      })
    )
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

PodPair.defaultProps = {
  data: {
    value: []
  },
  column: {
    size: 1
  }
}

export default PodPair
