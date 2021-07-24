import _ from 'lodash'
import { useMemo, useCallback } from 'react'
import { prefs } from '../constants'
import { useUIContext } from '../contexts/UI'
import { useTablesContext } from '../contexts/Tables'

export function useTables () {
  return useTablesContext()
}

export function useVersion () {
  const { versioning } = useUIContext()
  return versioning
}
export function usePreferences () {
  const { preferences } = useUIContext()
  const { value, update } = useMemo(() => preferences, [preferences])
  return {
    value,
    update
  }
}

export function useUI () {
  const { controls } = useUIContext()
  return controls
}

export function useIsUIAdvanced () {
  const { value: preferences } = usePreferences()
  const isEnabled = useMemo(
    () =>
      !_.isNil(preferences) &&
      [true, 'true'].includes(_.get(preferences, prefs.isAdvancedModeEnabled)),
    [preferences]
  )
  return isEnabled
}

export function useDarkMode () {
  const { value: preferences, update: updatePreferences } = usePreferences()
  const isDark = useMemo(
    () =>
      !_.isNil(preferences) &&
      [true, 'true'].includes(_.get(preferences, prefs.isDarkTheme)),
    [preferences]
  )

  const toggle = useCallback(
    value => {
      updatePreferences({
        [prefs.isDarkTheme]: !!value
      })
    },
    [updatePreferences]
  )

  return { isDark, toggle }
}

export function useUIModals () {
  const { modals } = useUI()
  return modals
}

export function useModal (id) {
  const { list, send } = useUIModals()

  const modal = useMemo(() => list.find(item => item.id === id), [list, id])

  const { isOpen, data: modalData } = useMemo(
    () => modal || { id, isOpen: false, data: null },
    [modal, id]
  )

  const setOpen = useCallback(
    (state = true, data = null) => {
      if (state) {
        send('open', { id, data })
      } else {
        send('close', { id, data })
      }
    },
    [send, id]
  )

  const setData = useCallback(
    data => {
      send('set', { id, data })
    },
    [send, id]
  )

  const updateData = useCallback(
    data => {
      send('update', { id, data })
    },
    [send, id]
  )

  return {
    isOpen,
    setOpen,
    setData,
    updateData,
    data: modalData
  }
}
