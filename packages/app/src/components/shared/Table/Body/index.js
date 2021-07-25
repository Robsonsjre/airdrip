import _ from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Theme from '../../../../themes'

import Row from '../Row'
import { Loader } from '../Placeholder'

const Wrapper = styled.div`
  width: 100%;
  padding: ${props => props.theme.sizes.edge};
  padding-top: 0;
  & > * {
    margin-bottom: calc(${props => props.theme.sizes.edge} * 1 / 3);
    &:last-child {
      margin-bottom: 0;
    }
  }

  min-height: calc(
    (${props => props.expected || 0}) * 66px +
      (${props => props.expected || 1} - 1) * ${props =>
  props.theme.sizes.edge} *
      1 / 3
  );

  &[data-loader="false"][data-theme="${Theme.constants.table.theme.slim}"]{
    & > * {
    margin-bottom: 0;
    border-top: 0;
    border-radius: 0;
    &:hover,
    &:active {
    border: 1px solid ${props => props.theme.colors.border};
    transition: border 250ms;
    border-top: 0;
  }
    &:first-child {
      margin-bottom: 0;
      border-radius: 8px 8px 0 0;
      border: 1px solid ${props => props.theme.colors.border};
    }
    &:last-child{
      border-radius: 0 0 8px 8px;
    }
    &:only-child{
      border-radius: 8px;
    }
  }
  }

  &[data-loader="false"][data-theme="${Theme.constants.table.theme.activity}"]{
    & > * {
    margin-bottom: 0;
    border-top: 0;
    border-radius: 0;
    &:hover,
    &:active {
    border: 1px solid ${props => props.theme.colors.border};
    transition: border 250ms;
    border-top: 0;
  }
    &:first-child {
      margin-bottom: 0;
      border-radius: 8px 8px 0 0;
      border: 1px solid ${props => props.theme.colors.border};
    }
    &:last-child{
      border-radius: 0 0 8px 8px;
    }
    &:only-child{
      border-radius: 8px;
    }
  }
  }

  &[data-loader="false"]{
  &[data-theme="${Theme.constants.table.theme.activitySlim}"]{
    & > * {
    margin-bottom: 0;
    border-top: 0;
    border-radius: 0;
    &:hover,
    &:active {
    border: 1px solid ${props => props.theme.colors.border};
    transition: border 250ms;
    border-top: 0;
  }
    &:first-child {
      margin-bottom: 0;
      border-radius: 8px 8px 0 0;
      border: 1px solid ${props => props.theme.colors.border};
    }
    &:last-child{
      border-radius: 0 0 8px 8px;
    }
    &:only-child{
      border-radius: 8px;
    }
  }
  }
  }




`

function Body ({ data }) {
  const { rows, isLoading, isEmpty, expected, theme } = useMemo(() => data, [
    data
  ])

  return (
    <Wrapper
      data-component='body'
      expected={expected}
      data-theme={theme}
      data-loader={isLoading || isEmpty}
    >
      {isLoading ? (
        <Loader theme={theme} size={expected} />
      ) : (
        <>
          {rows.map((row, index) => (
            <Row key={_.get(row, 'id')} position={index} data={data} />
          ))}
        </>
      )}
    </Wrapper>
  )
}

export default Body
