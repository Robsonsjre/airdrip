import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import { Spinner, Helper } from '../../../../atoms'

const Value = styled.p`
  &[data-unknown='true'] {
    font-size: 11pt !important;
    font-weight: 600 !important;
    color: ${props => props.theme.colors.white} !important;
  }
`

const Wrapper = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  ${Value} {
    ${props => props.theme.styles.tableParagraph};
  }

  &[data-theme="${Theme.constants.table.theme.slim}"]{
    ${Value} {
    ${props => props.theme.styles.tableParagraphSlim};
    }
  }

  *[data-purpose="helper-wrapper"]{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  *[data-purpose="helper-box"]{
    left: calc(100% + 8px);
  }
`

function Text ({ data, column, theme }) {
  const help = useMemo(() => _.get(data, 'helper'), [data])
  const isUnknown = useMemo(() => _.get(data, 'isUnknown'), [data])
  const isLoading = useMemo(() => _.get(data, 'isLoading'), [data])

  const content = useMemo(() => {
    const value = _.get(data, 'value')
    if (_.isArray(value)) return value.map(subvalue => _.toString(subvalue))
    return [_.toString(value)]
  }, [data])

  return (
    <Wrapper size={_.get(column, 'weight')} data-theme={theme}>
      {isLoading ? (
        <Spinner color={c => c.content} />
      ) : isUnknown ? (
        <Helper value='Connect your wallet to see this value' force='right'>
          <Value data-purpose='value' data-unknown='true'>
            ∅
          </Value>
        </Helper>
      ) : (
        <Helper value={help} force='right' isWrapper>
          {content.map(item => (
            <Value data-purpose='value' key={item}>
              {item}
            </Value>
          ))}
        </Helper>
      )}
    </Wrapper>
  )
}

Text.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.any,
    isLoading: PropTypes.bool,
    isUnknown: PropTypes.bool
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

Text.defaultProps = {
  data: {
    value: null,
    isLoading: false,
    isUnknown: false
  },
  column: {
    size: 1
  }
}

export default Text
