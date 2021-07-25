import React from 'react'
import styled from 'styled-components'
import TablePartial from '../../components/shared/Table'

import { useCampaignsTable } from '../../hooks'
import { Campaign } from '../../components/specific'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 140px;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: ${props => props.theme.sizes.canvasMaxWidth};
`

const TableWrapper = styled.div`
  width: 100%;
`

const Table = styled(TablePartial)`
  min-width: 1000px;
  padding: 0;

  div[data-component='body'] {
    min-height: 86px;
  }

  ${props => props.theme.medias.medium} {
    padding: 0 calc(${props => props.theme.sizes.layoutEdgeMedium});
  }
`

export default function Campaigns () {
  const { data } = useCampaignsTable()
  return (
    <Wrapper>
      <Content>
        <TableWrapper>
          <Table id='campaigns' data={data} />
        </TableWrapper>
      </Content>
      <Campaign />
    </Wrapper>
  )
}
