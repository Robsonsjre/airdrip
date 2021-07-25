import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Step, Label } from '../../../../shared/Form'

const Cell = styled.div`
  display: flex;
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  max-width: 460px;
  & > ${Cell} {
    max-width: 264px;
    &:first-child {
      padding-right: ${props => props.theme.sizes.edge};
      min-width: 200px;
    }
    &:last-child {
      flex: 1;
    }
  }

  ${props => props.theme.medias.small} {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    & > ${Cell} {
      &:first-child {
        max-width: 100%;
        width: 100%;
        padding: 0;
      }
      &:last-child {
        margin-top: ${props => props.theme.sizes.edge};
        max-width: 100%;
        width: 100%;
      }
    }
  }
`

function ContentSummary ({
  className,
  index,
  data,
  allow,
  transact,
  context,
  isForced
}) {
  return (
    <Step className={className} isLast>
      <Label>
        Step {_.isString(index) ? index : `${index}.`} Summary and confirmation{' '}
      </Label>
      <Row data-step='actions'>
        {allow && <Cell>{allow}</Cell>}
        {transact && <Cell>{transact}</Cell>}
      </Row>
    </Step>
  )
}

ContentSummary.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  allow: PropTypes.node,
  transact: PropTypes.node,
  data: PropTypes.shape({}),

  isForced: PropTypes.bool
}

ContentSummary.defaultProps = {
  index: 3,
  allow: null,
  transact: null,
  data: {},
  isForced: false
}

export default ContentSummary
