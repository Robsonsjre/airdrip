import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import advanced from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

import Theme from '../../../../../themes'

import TextDeck from '../TextDeck'

dayjs.extend(advanced)
dayjs.extend(relativeTime)
dayjs.extend(duration)

const Wrapper = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: center;
  & > p {
    ${props => props.theme.styles.tableParagraph};
  }


  &[data-theme="${Theme.constants.table.theme.slim}"]{
    & > p {
    ${props => props.theme.styles.tableParagraphSlim};
  }
  }

`

function Timestamp ({ data, column, theme }) {
  const split = useMemo(() => _.get(data, 'split'), [data])

  const base = useMemo(
    () => new BigNumber(_.get(data, 'value')).multipliedBy(1000).toNumber(),
    [data]
  )

  const value = useMemo(() => {
    if (split) {
      try {
        const formatted = dayjs(base).format("MMM Do 'YY,hh:mm A")
        return formatted.split(',')
      } catch (error) {
        return ['', '']
      }
    } else {
      try {
        return dayjs(base).format('MMM Do, YYYY')
      } catch (error) {
        return ''
      }
    }
  }, [base, split])

  if (split) {
    return (
      <TextDeck
        data={{
          ...data,
          value: _.get(value, '0'),
          subtitle: _.get(value, '1')
        }}
        column={column}
        theme={theme}
      />
    )
  }

  return (
    <Wrapper size={_.get(column, 'weight')} data-theme={theme}>
      <p>{value}</p>
    </Wrapper>
  )
}

Timestamp.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.any
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

Timestamp.defaultProps = {
  data: {
    value: null
  },
  column: {
    size: 1
  }
}

export default Timestamp
