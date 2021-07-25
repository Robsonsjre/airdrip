import _ from 'lodash'
import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../themes'

import { useTables } from '../../../hooks'

import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import { layout } from './Cells'

const WrapperPartial = styled.div`
  width: 100%;
`

const Box = styled.div`
  border-radius: ${props => props.theme.sizes.baseRadius};
  background-color: ${props => props.theme.colors.tint('10')};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  overflow: hidden;
`
const Wrapper = styled(WrapperPartial)``

function measure (columns) {
  const result = _.attempt(() =>
    columns
      .map(c => {
        const weight = _.get(c, 'weight')
        if (_.isNil(weight)) return '1fr'
        if (_.isNumber(weight)) return `${weight}fr`
        return weight
      })
      .join(' ')
  )

  return result && !_.isError(result) ? result : 0
}

function interpret (data) {
  const rows = _.toArray(_.get(data, 'rows'))
  const columns = _.toArray(_.get(data, 'columns'))
  const instructions = _.get(data, 'instructions')

  const { expected, empty, theme, footer, isLoading } = data
  const isEmpty = !isLoading && rows.length === 0
  const size = measure(columns)

  return {
    rows,
    columns,
    instructions,

    size,
    expected,
    empty,
    theme,
    footer,
    isLoading,
    isEmpty
  }
}
function Table ({ data: payload, id, className, children }) {
  const { get, set } = useTables(id)

  useEffect(() => {
    set(id, payload)
  }, [id, payload, set])

  const data = useMemo(() => interpret(get(id)), [id, get])

  return (
    <Wrapper
      id={id}
      className={className}
      data-theme={data.theme}
      data-component='table'
    >
      <Box data-component='box'>
        <Header data={data} />
        <Body data={data} />
        <Footer data={data} />
        {children}
      </Box>
    </Wrapper>
  )
}

Table.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.any.isRequired,
        subtitle: PropTypes.any,
        weight: PropTypes.number,
        help: PropTypes.string,
        id: PropTypes.string
      })
    ),
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        cells: PropTypes.arrayOf(PropTypes.shape({}))
      })
    ),
    instructions: PropTypes.shape({
      onRowClick: PropTypes.func
    }),
    footer: PropTypes.oneOf(['more', 'more-loading', null]),
    theme: PropTypes.oneOf(Object.values(Theme.constants.table.theme)),
    isLoading: PropTypes.bool,
    expected: PropTypes.number,
    empty: PropTypes.number
  })
}

Table.defaultProps = {
  data: {
    columns: [],
    rows: [],
    instructions: {
      onRowClick: () => {}
    },
    footer: null,
    theme: Theme.constants.table.theme.classic,
    isLoading: true,
    empty: 0,
    expected: 1
  }
}

export { layout }
export default Table
