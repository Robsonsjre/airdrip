import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from '../../../../../themes'
import { Spinner } from '../../../../atoms'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Skeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 66px;
  border-radius: 8px;
  margin-bottom: calc(${props => props.theme.sizes.edge} * 1 / 3);
  background-color: ${props => props.theme.colors.white};
  padding-left: calc(${props => props.theme.sizes.edge} * 1);
  box-shadow: ${props => props.theme.styles.boxShadowInset};
  background-image: linear-gradient(
    -90deg,
    ${props => props.theme.colors.platform},
    ${props => props.theme.colors.white}
  );

  &[data-theme="${Theme.constants.table.theme.slim}"],
  &[data-theme="${Theme.constants.table.theme.activitySlim}"]
  {
    height: 52px;
    margin-bottom: 0px;
    border-radius: 0px;


    &:first-child {
      border-radius: 8px 8px 0 0;
    }
    &:last-child{
      border-radius: 0 0 8px 8px;
    }
    &:only-child{
      border-radius: 8px;
    }
  }

  &[data-theme="${Theme.constants.table.theme.activity}"]{
    margin-bottom: 0px;
    border-radius: 0px;


    &:first-child {
      border-radius: 8px 8px 0 0;
    }
    &:last-child{
      border-radius: 0 0 8px 8px;
    }
    &:only-child{
      border-radius: 8px;
    }
  }

`

function Loader ({ theme, size }) {
  return (
    <Wrapper>
      {[...Array(parseInt(size) || 0).keys()].map(index => (
        <Skeleton key={index} data-theme={theme} data-component='row-loader'>
          <Spinner color={c => c.content} size={30} thickness={1.5} />
        </Skeleton>
      ))}
    </Wrapper>
  )
}

Loader.propTypes = {
  theme: PropTypes.string,
  size: PropTypes.number
}

Loader.defaultProps = {
  theme: Theme.constants.table.theme.classic,
  size: 0
}

export default Loader
