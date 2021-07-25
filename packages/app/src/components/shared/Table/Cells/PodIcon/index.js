import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import { useToken } from '../../../../../hooks'

const WrapperPartial = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const Indicator = styled.div`
  position: relative;
  height: 100%;
  width: ${props => props.theme.sizes.edge};
`

const Wrapper = styled(WrapperPartial)`
&[data-theme="${Theme.constants.table.theme.slim}"]{
  padding-right: 0;
  ${Box}{
    padding: 0;
    background-color: ${props => props.theme.colors.transparent};
    border: none;

  }

  ${Icon}{
      height: 20px;
      width: 20px;
    }


  ${Indicator}{
    display: none;
  }
}
`

function PodIcon ({ data, column, theme }) {
  const { value } = data
  const { value: token } = useToken(value)

  return (
    <Wrapper
      size={_.get(column, 'weight')}
      data-theme={theme}
      data-component='pod-asset'
    >
      <Box>
        <Icon title={_.get(token, 'symbol')} src={_.get(token, 'icon')} />
        <Indicator />
      </Box>
    </Wrapper>
  )
}

PodIcon.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.shape({
      symbol: PropTypes.string.isRequired
    })
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

PodIcon.defaultProps = {
  data: {
    value: null
  },
  column: {
    size: 1
  }
}

export default PodIcon
