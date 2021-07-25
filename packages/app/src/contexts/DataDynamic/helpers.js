import _ from 'lodash'
import SDK from '@pods-finance/sdk'
import { macros } from '../../constants'

function customizer (addition, source) {
  if (_.isArray(addition)) {
    return _.uniqBy(addition.concat(source), item => item.id)
  }
}

export async function updateGeneralDynamics ({ options, provider, dispatch }) {
  if (
    _.isNil(options) ||
    !options.every(option => !_.isNilOrEmptyString(option.address))
  ) {
    console.error('Dynamic General Data: options misconfigured.')
    return
  }

  if (!options.length) return

  try {
    dispatch(
      options.map(option => [
        option.address,
        {
          element: { isLoading: true, warning: null }
        }
      ]),
      'MULTI_DEEP_UPDATE'
    )

    console.info('[ ---- ] Requesting general dynamics')

    const dynamics = await SDK.Multicall.getGeneralDynamics({
      provider,
      options: options.map(option => option.fromSDK())
    })

    if (dynamics && Object.values(dynamics).length) {
      dispatch(
        Object.keys(dynamics).map(address => [
          address,
          {
            element: {
              isLoading: false,
              value: dynamics[address]
            }
          }
        ]),
        'MULTI_DEEP_UPDATE'
      )
    }
  } catch (error) {
    console.error('Option: ', error)

    dispatch(
      options.map(option => [
        option.address,
        {
          element: { isLoading: false, value: null, warning: error.message }
        }
      ]),
      'MULTI_DEEP_UPDATE'
    )
  }
}

export async function updateUserDynamics ({
  options,
  provider,
  signer,
  dispatch
}) {
  if (
    _.isNil(options) ||
    !options.every(option => !_.isNilOrEmptyString(option.address))
  ) {
    console.error('Dynamic User Data: options misconfigured.')
    return
  }

  if (!options.length) return

  try {
    dispatch(
      options.map(option => [
        option.address,
        {
          element: { isLoading: true, warning: null }
        }
      ]),
      'MULTI_DEEP_UPDATE'
    )

    console.info('[ ---- ] Requesting user dynamics')

    const user = await signer.getAddress()
    const dynamics = await SDK.Multicall.getUserDynamics({
      user,
      provider,
      options: options.map(option => option.fromSDK())
    })

    if (dynamics && Object.values(dynamics).length) {
      dispatch(
        Object.keys(dynamics).map(address => [
          address,
          {
            element: {
              isLoading: false,
              value: dynamics[address]
            }
          }
        ]),
        'MULTI_DEEP_UPDATE'
      )
    }
  } catch (error) {
    console.error('Option: ', error)

    dispatch(
      options.map(option => [
        option.address,
        {
          element: { isLoading: false, value: null, warning: error.message }
        }
      ]),
      'MULTI_DEEP_UPDATE'
    )
  }
}

export async function updateUserActivity ({
  signer,
  provider,
  apollo,
  timestamp,
  dispatch,
  elements
}) {
  if (_.isNil(apollo) || _.isNil(provider) || _.isNil(signer)) {
    console.error('Activity: user misconfigured.')
    return
  }

  try {
    dispatch(
      [elements.manager, { isLoading: true, warning: null }],
      'DEEP_UPDATE'
    )

    console.info('[ ---- ] Requesting user activity')

    const user = await signer.getAddress()
    const networkId = ((await provider.getNetwork()) || {}).chainId

    const activity = await SDK.ActionBuilder.fromUser({
      user,
      networkId,
      client: apollo.engine,
      first: macros.ACTIVITY_PAGINATOR,
      timestamp
    })

    if (activity && activity.length) {
      dispatch(
        [
          [elements.store, { value: activity }, customizer],
          [
            elements.manager,
            {
              isLoading: false,
              isFinished:
                activity && activity.length < macros.ACTIVITY_PAGINATOR
            }
          ]
        ],
        'MULTI_DEEP_UPDATE'
      )
    } else {
      dispatch(
        [
          elements.manager,
          {
            isLoading: false,
            isFinished: true,
            warning: 'No more activity for this user.'
          }
        ],
        'DEEP_UPDATE'
      )
    }
  } catch (error) {
    console.error(error)
    dispatch(
      [
        elements.manager,
        {
          isLoading: false,
          isFinished: true,
          warning: error.message
        }
      ],
      'DEEP_UPDATE'
    )
  }
}

export async function updateOptionsActivity ({
  options,
  provider,
  signer,
  apollo,
  dispatch
}) {
  if (
    _.isNil(options) ||
    !options.every(option => !_.isNilOrEmptyString(option.address))
  ) {
    console.error('Activity: options misconfigured.')
    return
  }

  if (!options.length) return

  try {
    dispatch(
      options.map(option => [
        [
          option.address,
          { element: { value: [], isLoading: true, warning: null } }
        ]
      ]),
      'MULTI_SET'
    )

    console.info('[ ---- ] Requesting options activity')

    const user = await signer.getAddress()
    const networkId = ((await provider.getNetwork()) || {}).chainId

    const list = await SDK.ActionBuilder.fromOptionsAndUser({
      client: apollo.engine,
      options: options.map(option => option.address),
      user,
      networkId,
      first: 3,
      timestamp: Math.floor(Date.now() / 1000) + 1
    })

    if (list && Object.keys(list).length) {
      dispatch(
        Object.keys(list).map(address => [
          address,
          {
            element: {
              isLoading: false,
              value: list[address],
              warning: null
            }
          }
        ]),
        'MULTI_SET'
      )
    } else {
      dispatch(
        options.map(option => [
          option.address,
          {
            element: {
              isLoading: false,
              value: [],
              warning: 'No activity found'
            }
          }
        ]),
        'MULTI_SET'
      )
    }
  } catch (error) {
    console.error('Activity: ', error)

    dispatch(
      options.map(option => [
        option.address,
        {
          element: {
            isLoading: false,
            value: null,
            warning: error.message
          }
        }
      ]),
      'MULTI_SET'
    )
  }
}

export async function updateUserActivePositions ({
  apollo,
  options,
  provider,
  signer,
  dispatch
}) {
  if (
    _.isNil(options) ||
    !options.every(option => !_.isNilOrEmptyString(option.address))
  ) {
    console.error('Positions Data: options misconfigured.')
    return
  }

  if (!options.length) return

  try {
    dispatch(
      [
        ['isLoading', { value: true }],
        ['warning', { value: null }]
      ],
      'MULTI_DEEP_UPDATE'
    )

    console.info('[ ---- ] Requesting user positions')

    const user = await signer.getAddress()
    const networkId = ((await provider.getNetwork()) || {}).chainId

    const positions = await SDK.PositionBuilder.fromOptionsAndUser({
      user,
      networkId,
      client: apollo.engine,
      options: options.map(option => option.address)
    })

    if (positions && Object.values(positions).length) {
      dispatch(
        Object.keys(positions)
          .map(address => [
            address,
            {
              element: {
                isLoading: false,
                value: positions[address]
              }
            }
          ])
          .concat([
            ['isLoading', { value: false }],
            ['warning', { value: null }]
          ]),
        'MULTI_DEEP_UPDATE'
      )
    }
  } catch (error) {
    console.error('Position: ', error)

    dispatch(
      [
        ['isLoading', { value: false }],
        ['warning', { value: error.message }]
      ],
      'MULTI_DEEP_UPDATE'
    )
  }
}

export async function updateUserHistoricalPositions ({
  blacklisted,
  apollo,
  provider,
  signer,
  dispatch
}) {
  try {
    dispatch(
      [
        ['isLoading', { value: true }],
        ['warning', { value: null }]
      ],
      'MULTI_DEEP_UPDATE'
    )

    console.info('[ ---- ] Requesting user positions (HISTORICAL)')

    const user = await signer.getAddress()
    const networkId = ((await provider.getNetwork()) || {}).chainId

    const positions = await SDK.PositionBuilder.fromUser({
      user,
      networkId,
      client: apollo.engine,
      blacklisted: blacklisted.map(option => option.address),
      first: 50
    })

    if (positions && positions.length) {
      dispatch(
        positions
          .map(position => [
            _.get(position, 'id'),
            {
              element: {
                value: position
              }
            }
          ])
          .concat([
            ['isLoading', { value: false }],
            ['warning', { value: null }]
          ]),
        'MULTI_DEEP_UPDATE'
      )
    } else {
      dispatch(
        [
          ['isLoading', { value: false }],
          ['warning', { value: 'No historical positions yet.' }]
        ],
        'MULTI_DEEP_UPDATE'
      )
    }
  } catch (error) {
    console.error('Position: ', error)

    dispatch(
      [
        ['isLoading', { value: false }],
        ['warning', { value: error.message }]
      ],
      'MULTI_DEEP_UPDATE'
    )
  }
}
