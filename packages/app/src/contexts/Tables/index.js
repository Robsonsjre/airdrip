import _ from 'lodash'
import React, { createContext, useContext, useState, useCallback } from 'react'
import Theme from '../../themes'

/**
 * columns: define the format of the table, column names and weight
 * rows: actual data to display inside the table
 * instructions: methods to be triggered in certain key moments (e.g. onRowClick)
 * expected: a rough value for the number of expected rows, for a better Placeholder-Loader layout (number of loader-rows)
 * empty: layout case for the isEmpty (read-only) state (e.g. default is 0)
 * isLoading: boolean to toggle the Placeholder-Loader state
 */
const initial = {
  columns: [],
  rows: [],
  instructions: { onRowClick: _.noop },
  expected: 1,
  empty: 0,
  isLoading: false,
  theme: Theme.constants.table.theme.classic,
  footer: null
}

export const TablesContext = createContext()

export default function Provider ({ children }) {
  const value = useTablesData()
  return (
    <TablesContext.Provider value={value}>{children}</TablesContext.Provider>
  )
}

export function useTablesContext () {
  return useContext(TablesContext)
}

function useTablesData () {
  const [data, setData] = useState({})

  const set = useCallback(
    (id, values = null) =>
      setData(prev => ({
        ...prev,
        [id]: values || initial
      })),
    []
  )

  const cleanup = useCallback(
    id =>
      setData(prev => ({
        ...prev,
        [id]: undefined
      })),
    []
  )

  const get = useCallback(
    id => {
      if (_.has(data, id)) return _.get(data, id)
      return initial
    },
    [data]
  )

  return {
    cleanup,
    set,
    get
  }
}
