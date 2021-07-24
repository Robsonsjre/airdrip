import _ from 'lodash'
import { useMemo } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import { networks, subgraphed } from '../constants'

const kovan = new ApolloClient({
  link: new HttpLink({
    uri: subgraphed(networks.kovan)
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

const mainnet = new ApolloClient({
  link: new HttpLink({
    uri: subgraphed(networks.mainnet)
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

const matic = new ApolloClient({
  link: new HttpLink({
    uri: subgraphed(networks.matic)
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

const mumbai = new ApolloClient({
  link: new HttpLink({
    uri: subgraphed(networks.mumbai)
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const client = {
  [networks.kovan]: kovan,
  [networks.mainnet]: mainnet,
  [networks.matic]: matic,
  [networks.mumbai]: mumbai
}

export function getClient (networkId) {
  return _.get(client, networkId)
}

export function useClient (networkId) {
  const item = useMemo(
    () => ({
      engine: getClient(networkId),
      networkId
    }),
    [networkId]
  )

  return item
}
