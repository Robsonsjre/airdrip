import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spinner, Helper } from '../../../../atoms'
import { macros } from '../../../../../constants'
import IconWarning from '@material-ui/icons/WarningRounded'

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  position: relative;
`

const Wrapper = styled.div`
  grid-column: span 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  & > ${Container} > p {
    ${props => props.theme.styles.tableParagraph};
  }

  *[data-purpose='helper-wrapper'] {
    display: flex;
    align-items: center;
  }
`

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};
  margin-left: -1px;

  & > svg {
    font-size: 11pt;
    color: ${props => props.theme.colors.dark};
    transition: color 250ms;
    margin-right: 4px;
  }
  & > p {
    font-size: 9pt;
    color: ${props => props.theme.colors.dark};
    font-weight: 700;
    transition: color 250ms;
  }

  &[data-component='label-warning'] {
    & > svg,
    & > p {
      color: ${props => props.theme.colors.dark};
    }
  }

  & ~ *[data-purpose='helper-box'] {
    left: calc(100% + 8px);
  }
`

function Reward ({ data, column, theme }) {
  const content = useMemo(() => {
    const value = _.get(data, 'value')
    if (_.isArray(value)) {
      return value.map(subvalue => _.toString(subvalue)).join(', ')
    }
    return _.toString(value)
  }, [data])

  const restrictedPrice = useMemo(
    () =>
      !_.get(data, 'isLoading') &&
      [macros.RESTRICTED_APR, macros.RESTRICTED_PREMIUM].includes(content),
    [data, content]
  )

  const [warning, help] = useMemo(() => {
    if (_.get(data, 'durations.isExpired')) {
      return [
        'Ended',
        'Trading window completed. This option has fully expired.'
      ]
    }
    if (_.get(data, 'durations.isExercising')) {
      return [
        'Exercising',
        'Exercising window available. Exercise or manage liquidity now.'
      ]
    }
    if (restrictedPrice) {
      return [
        'Unavailable',
        'The price is too close to 0. Trading may resume once the AMM gains more liquidity.'
      ]
    }

    return [null, null]
  }, [data, restrictedPrice])

  return (
    <Wrapper size={_.get(column, 'weight')} data-theme={theme}>
      <Container>
        {_.get(data, 'isLoading') && <Spinner color={c => c.content} />}{' '}
        {!_.get(data, 'isLoading') &&
          (restrictedPrice || _.get(data, 'durations.isExpired') ? (
            <Helper value={help} force='right'>
              <Label data-component='label-warning'>
                <IconWarning />
                <p>{warning}</p>
              </Label>
            </Helper>
          ) : (
            <p>{content}</p>
          ))}
      </Container>
    </Wrapper>
  )
}

Reward.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.any,
    isLoading: PropTypes.bool,
    warning: PropTypes.string
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

Reward.defaultProps = {
  data: {
    value: null,
    isLoading: false,
    warning: 'Unavailable'
  },
  column: {
    size: 1
  }
}

export default Reward
