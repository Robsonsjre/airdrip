import _ from 'lodash'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import dayjs from 'dayjs'
import { tokens } from '../../constants'

const start = dayjs()
  .subtract(1, 'week')
  .unix()

const source = {
  coingecko: {
    id: 'coingecko',
    spotWBTC:
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=USD',
    spotETH:
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD',
    spotLINK:
      'https://api.coingecko.com/api/v3/simple/price?ids=chainlink&vs_currencies=USD',
    spotMATIC:
      'https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=USD',
    historicalWBTC:
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1',
    historicalETH:
      'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1',
    historicalLINK:
      'https://api.coingecko.com/api/v3/coins/chainlink/market_chart?vs_currency=usd&days=1',
    historicalMATIC:
      'https://api.coingecko.com/api/v3/coins/wmatic/market_chart?vs_currency=usd&days=1',
    spotInterpretor: response => {
      return response
        .json()
        .then(result =>
          _.get(Object.values(_.toPlainObject(result)), '[0].usd')
        )
    },
    historicalInterpretor: response => {
      return response
        .json()
        .then(result =>
          _.toArray(_.get(result, 'prices'))
            .filter((_value, index) => index % 12 === 0)
            .map(price => _.get(price, '[1]'))
        )
        .catch(e => {
          console.error('Price', e)
          return [0]
        })
    }
  },
  coinpaprika: {
    id: 'coinpaprika',
    spotWBTC: 'https://api.coinpaprika.com/v1/tickers/wbtc-wrapped-bitcoin',
    spotETH: 'https://api.coinpaprika.com/v1/tickers/eth-ethereum',
    spotLINK: 'https://api.coinpaprika.com/v1/tickers/link-chainlink',
    spotMATIC: 'https://api.coinpaprika.com/v1/tickers/matic-matic-network',
    historicalWBTC: `https://api.coinpaprika.com/v1/tickers/wbtc-wrapped-bitcoin/historical?start=${start}&interval=12h`,
    historicalETH: `https://api.coinpaprika.com/v1/tickers/eth-ethereum/historical?start=${start}&interval=12h`,
    historicalLINK: `https://api.coinpaprika.com/v1/tickers/link-chainlink/historical?start=${start}&interval=12h`,
    historicalMATIC: `https://api.coinpaprika.com/v1/tickers/matic-matic-network/historical?start=${start}&interval=12h`,
    spotInterpretor: response => {
      return response.json().then(token => _.get(token, 'quotes.USD.price'))
    },
    historicalInterpretor: response => {
      return response
        .json()
        .then(timestamps => timestamps.map(timestamp => timestamp.price))
        .catch(e => {
          console.error('Price', e)
          return [0]
        })
    }
  }
}

const feed = source.coingecko

export const PriceContext = createContext(undefined)

export default function Provider ({ children }) {
  const value = usePricing()

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
}

export function usePriceContext () {
  return useContext(PriceContext)
}

function usePricing () {
  const [prices, setPrices] = useState({
    spot: null,
    historical: null,
    isLoading: true
  })

  const fetchPrices = useCallback(async () => {
    setPrices(prev => ({
      ...prev,
      isLoading: true
    }))
    const list = await Promise.all([
      fetch(feed.spotWBTC).then(getAPIPrice),
      fetch(feed.spotETH).then(getAPIPrice),
      fetch(feed.spotLINK).then(getAPIPrice),
      fetch(feed.spotMATIC).then(getAPIPrice)
    ])

    const historical = await Promise.all([
      fetch(feed.historicalWBTC).then(getAPIHistoricalPrices),
      fetch(feed.historicalETH).then(getAPIHistoricalPrices),
      fetch(feed.historicalLINK).then(getAPIHistoricalPrices),
      fetch(feed.historicalMATIC).then(getAPIHistoricalPrices)
    ])

    setPrices({
      spot: {
        [tokens.keys.WBTC]: list[0],
        [tokens.keys.ETH]: list[1],
        [tokens.keys.WETH]: list[1],
        [tokens.keys.LINK]: list[2],
        [tokens.keys.MATIC]: list[3],
        [tokens.keys.WMATIC]: list[3]
      },
      historical: {
        [tokens.keys.WBTC]: [...historical[0], list[0]],
        [tokens.keys.ETH]: [...historical[1], list[1]],
        [tokens.keys.WETH]: [...historical[1], list[1]],
        [tokens.keys.LINK]: [...historical[2], list[2]],
        [tokens.keys.MATIC]: [...historical[3], list[3]],
        [tokens.keys.WMATIC]: [...historical[3], list[3]]
      },
      isLoading: false
    })
  }, [])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return prices
}

function getAPIPrice (response) {
  try {
    return feed.spotInterpretor(response).then(x => x)
  } catch (e) {
    console.error('Price', e)
    return 0
  }
}

function getAPIHistoricalPrices (response) {
  try {
    return feed.historicalInterpretor(response)
  } catch (e) {
    console.error('Price', e)
    return [0]
  }
}
