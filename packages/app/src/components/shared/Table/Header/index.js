import _ from 'lodash'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme from '../../../../themes'
import { Helper } from '../../../atoms'

const WrapperPartial = styled.div`
  display: grid;
  grid-template-columns: ${props => props.size || '1fr'};
  grid-gap: calc(${props => props.theme.sizes.edge} * 1);
  padding: 0 calc(${props => props.theme.sizes.edge} * 3 / 2 + 1px);
  width: 100%;
  min-height: 40px;
`

const CellWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-column: span 1;
  padding: ${props => props.theme.sizes.edge} 0;
  &:first-child {
    margin-left: -1px;
  }
`

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 10pt;
  font-weight: 600;
  color: ${props => props.theme.colors.contentMedium};
  text-align: left;

  & > p {
    margin: 0;
  }
  svg {
    color: ${props => props.theme.colors.contentMedium};
    font-size: 13pt;
    margin-right: 4px;
  }
`

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 9pt;
  font-weight: 600;
  color: ${props => props.theme.colors.content};

  & > p {
    margin: 0;
  }
  & > svg {
    color: ${props => props.theme.colors.content};
    font-size: 13pt;
    margin-left: 4px;
  }
`

const Wrapper = styled(WrapperPartial)`
  &[data-theme=${Theme.constants.table.theme.slim}]{
    ${Title}{
      font-size: 10pt;
      font-weight: 700;
      svg {
        font-size: 11pt;
      }
    }
    ${Subtitle}{
      font-size: 9pt;
      svg {
        font-size: 11pt;
      }
    }
  }


`

function Cell ({ weight, help, title, subtitle, id }) {
  return (
    <CellWrapper weight={weight} data-id={id} data-component='cell'>
      <Helper value={help} force='bottom'>
        <Title>{title}</Title>
        {!_.isNil(subtitle) && <Subtitle>{subtitle}</Subtitle>}
      </Helper>
    </CellWrapper>
  )
}

Cell.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  subtitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  weight: PropTypes.number,
  help: PropTypes.string,
  id: PropTypes.string
}

Cell.defaultProps = {
  weight: 1,
  help: null,
  id: null,
  subtitle: null
}

function Header ({ data }) {
  const { columns, size, theme } = useMemo(() => data, [data])

  return (
    <Wrapper size={size} data-component='header' data-theme={theme}>
      {columns.map(column => (
        <Cell key={_.get(column, 'id') || _.get(column, 'title')} {...column} />
      ))}
    </Wrapper>
  )
}

export default Header
