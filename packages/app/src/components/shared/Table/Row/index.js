import _ from 'lodash'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import Theme from '../../../../themes'
import { lighten } from 'polished'
import CellLayouts from '../Cells'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${props => props.size || '1fr'};
  grid-gap: calc(${props => props.theme.sizes.edge} * 1);
  padding: calc(${props => props.theme.sizes.edge} * 1 / 2);
  width: 100%;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.platform};
  border: 1px solid ${props => props.theme.colors.border};
  transition: border 150ms;
  cursor: pointer;

  & > * {
    min-height: 40px;
  }

  &:hover,
  &:active {
    background-color: ${props => props.theme.colors.tint(15)};
  }

  ${props =>
    props.theme.isDark &&
    css`
      &:hover,
      &:active {
        border: 1px solid ${props => props.theme.colors.border};
        background-color: ${props =>
          lighten(0.05, props.theme.colors.platform)};
      }
    `}

  &[data-theme="${Theme.constants.table.theme.activity}"],
  &[data-theme="${Theme.constants.table.theme.activitySlim}"]{
    background-color: ${props =>
      props.theme.isDark
        ? props.theme.colors.platfrom
        : props.theme.colors.white};

  }

  &[data-theme="${Theme.constants.table.theme.slim}"]{
    background-color: ${props => props.theme.colors.transparent};
    padding: 0 calc(${props => props.theme.sizes.edge} * 1 / 2);
      &:hover,
      &:active {
      background-color: ${props => props.theme.colors.platform};
    }
  }

  &[data-dim="true"]{
    div[data-component="pod-asset"], div[data-component="pod-pair"]{
        img{
          filter: grayscale(95%);
          opacity: 0.5;
        }
    }
  }

`

function Row ({ position, data }) {
  const { size, rows, columns, theme, instructions } = useMemo(() => data, [
    data
  ])
  const { onRowClick } = useMemo(() => instructions, [instructions])
  const { id, cells } = useMemo(() => rows[position], [rows, position])

  return useMemo(
    () => (
      <Wrapper
        data-component='row'
        data-theme={theme}
        data-id={id}
        data-dim={_.get(
          cells,
          `[${_.get(cells, 'length') - 1}].durations.isExpired`
        )}
        size={size}
        onClick={e =>
          onRowClick({
            event: e,
            id,
            position
          })}
      >
        {_.toArray(cells).map((cell, index) => {
          try {
            const column = columns[index]
            const props = {
              key: _.get(column, 'id') || _.get(column, 'title'),
              column,
              position: {
                row: position,
                column: index
              },
              data: cell,
              theme
            }

            const Component = CellLayouts[_.get(column, 'layout')]

            if (!_.isNil(Component)) return <Component {...props} />
            return <CellLayouts.Text {...props} />
          } catch (e) {
            console.error(e)
          }
          return null
        })}
      </Wrapper>
    ),
    [cells, columns, id, onRowClick, position, size, theme]
  )
}

export default Row
