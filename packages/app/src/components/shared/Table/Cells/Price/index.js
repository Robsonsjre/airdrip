import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import IconMarket from '@material-ui/icons/TimelineRounded'

const WrapperPartial = styled.div`
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const Strike = styled.p`
  ${props => props.theme.styles.tableParagraph};
`

const Market = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  & > p {
    font-size: 9pt;
    font-weight: 600;
    color: ${props => props.theme.colors.tint(90)};
    margin: 0;
  }
  & > svg {
    color: ${props => props.theme.colors.tint(90)};
    font-size: 13pt;
    margin-left: 4px;
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-theme="${Theme.constants.table.theme.slim}"]{
    ${Strike}{
      ${props => props.theme.styles.tableParagraphSlim};
    }
    ${Market}{
      margin-top: 2px;
      & > p{
        font-size: 9pt;
      }
      & > svg{
        font-size: 11pt;
      }
    }
  }
`

function Price ({ data, column, theme }) {
  return (
    <Wrapper size={_.get(column, 'weight')} data-theme={theme}>
      <Strike title='Option strike price'>{_.get(data, 'value')}</Strike>
      <Market title='Current market price'>
        <p>{_.get(data, 'market')}</p>
        <IconMarket />
      </Market>
    </Wrapper>
  )
}

Price.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    market: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

Price.defaultProps = {
  data: {
    value: null,
    makert: null
  },
  column: {
    size: 1
  }
}

export default Price
