import _ from 'lodash'
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import numeral from 'numeral'
import IconPrice from '@material-ui/icons/TimelineRounded'
import IconConstant from '@material-ui/icons/LinearScaleRounded'
import { rgba } from 'polished'
import { Line } from 'react-chartjs-2'
import BigNumber from 'bignumber.js'

const WrapperPartial = styled.div`
  position: relative;
  grid-column: span 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${props => props.theme.sizes.edge};
  padding-right: ${props => props.theme.sizes.edge};
  height: 75px;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 45px;
  margin-right: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.tint(10)};
  box-shadow: ${props => props.theme.styles.boxShadowInset};
  flex-shrink: 0;

  & > img {
    height: 26px;
    width: 26px;
    background-color: ${props => props.theme.colors.platform};
    border-radius: 50%;
    flex-shrink: 0;
    &[src=''],
    &:not([src]) {
      opacity: 0;
    }
  }
`

const Data = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Title = styled.div`
  margin-bottom: 4px;
  text-align: left;
  & > p {
    font-size: 11pt;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
    margin: 0;
  }
`

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & > p {
    font-size: 10pt;
    font-weight: 600;
    color: ${props => props.theme.colors.green};
    margin: 0;
  }
  & > svg {
    margin-left: 2px;
    font-size: 11pt;
    color: ${props => props.theme.colors.green};
  }
`

const Playground = styled.div`
  height: 300px;
  width: calc(100% + 12px);
  margin-left: -10px;

  &[data-constant='true'] {
    margin-top: -10px;
  }
`

const Wrapper = styled(WrapperPartial)`
  ${Price} {
    & > p,
    & > svg {
      color: ${props => props.color || props.theme.colors.green};
    }
  }
`

const options = {
  maintainAspectRatio: false,
  responsive: true,
  layout: {
    padding: {
      left: 0,
      bottom: 6,
      top: 6,
      right: 0
    }
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  scales: {
    xAxes: [
      {
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }
    ]
  }
}

function Element ({ token, color, dataset, spot, isConstant }) {
  const data = useCallback(
    canvas => {
      const ctx = canvas.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 300)

      gradient.addColorStop(0, rgba(color, 0.5))
      gradient.addColorStop(0.8, rgba(color, 0.1))
      gradient.addColorStop(1, rgba(color, 0))

      return {
        labels: dataset,
        datasets: [
          {
            backgroundColor: gradient,
            borderWidth: 1,
            pointRadius: 0,
            borderColor: color,
            data: dataset
          }
        ]
      }
    },
    [dataset, color]
  )

  return (
    <Wrapper color={color} data-loading={false}>
      <Header>
        <Icon title={_.get(token, 'symbol')}>
          <img alt='' src={_.get(token, 'icon')} />
        </Icon>
        <Data>
          <Title>
            <p>{_.get(token, 'symbol')}</p>
          </Title>
          <Price>
            <p>{!_.isNil(spot) ? numeral(spot).format('$0,0.[00]') : ''}</p>
            {!_.isNil(spot) && new BigNumber(spot).isEqualTo(1) ? (
              <IconConstant />
            ) : (
              <IconPrice />
            )}
          </Price>
        </Data>
      </Header>
      <Playground data-constant={isConstant}>
        <Line height={300} data={data} options={options} />
      </Playground>
    </Wrapper>
  )
}

Element.propTypes = {
  token: PropTypes.shape({}),
  color: PropTypes.string,
  dataset: PropTypes.arrayOf(PropTypes.number),
  spot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isConstant: PropTypes.bool,
  isRestricted: PropTypes.bool
}

Element.defaultProps = {
  token: null,
  color: Theme.colors.green,
  dataset: [],
  spot: null,
  isConstant: false,
  isRestricted: false
}

export default Element
