import _ from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { EmptyLoad } from '../Placeholder/Empty'
import Loader from '../Placeholder/Loader'

const Wrapper = styled.div`
  display: flex;
  padding: calc(${props => props.theme.sizes.edge} * 1);
  margin-top: calc(
    (
        ${props => props.theme.sizes.edge} - ${props => props.theme.sizes.edge} *
          1 / 3
      ) * -1
  );
  padding-top: 0;
  width: 100%;
  min-height: 40px;
  &:empty {
    min-height: 0;
    padding: 0;
    margin: 0;
  }
`

const Content = styled.div`
  width: 100%;
  display: none;
  &[data-active='true'] {
    display: flex;
  }
`

function Footer ({ data }) {
  const { footer } = useMemo(() => data, [data])
  const { onLoadMore } = useMemo(() => _.get(data, 'instructions') || {}, [
    data
  ])

  return (
    <Wrapper>
      {['more', 'more-loading'].includes(footer) && (
        <>
          <Content data-active={footer === 'more'}>
            <EmptyLoad onLoadMore={onLoadMore} />
          </Content>
          <Content data-active={footer === 'more-loading'}>
            <Loader size={1} />
          </Content>
        </>
      )}
    </Wrapper>
  )
}

export default Footer
