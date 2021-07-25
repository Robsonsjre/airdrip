import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../../themes'
import { Helper } from '../../../../atoms'
const WrapperPartial = styled.div`
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const Title = styled.p`
  ${props => props.theme.styles.tableParagraph};
`

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  & > p {
    font-size: 9pt;
    font-weight: 600;
    color: ${props => props.theme.colors.tint(90)};
    margin: 0;
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-theme="${Theme.constants.table.theme.slim}"]{
    ${Title}{
      ${props => props.theme.styles.tableParagraphSlim};
    }
    ${Subtitle}{
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

function TextDeck ({ data, column, theme }) {
  const help = useMemo(() => _.get(data, 'helper'), [data])
  return (
    <Wrapper size={_.get(column, 'weight')} data-theme={theme}>
      <Helper value={help} force='right' isWrapper>
        <Title>{_.get(data, 'value')}</Title>
      </Helper>
      {!_.isNilOrEmptyString(_.get(data, 'subtitle')) && (
        <Subtitle>
          <p>{_.get(data, 'subtitle')}</p>
        </Subtitle>
      )}
    </Wrapper>
  )
}

TextDeck.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    subtitle: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  column: PropTypes.shape({
    size: PropTypes.number
  })
}

TextDeck.defaultProps = {
  data: {
    value: null,
    subtitle: null
  },
  column: {
    size: 1
  }
}

export default TextDeck
