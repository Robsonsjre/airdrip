import SDK from '@pods-finance/sdk'
import _ from 'lodash'

export async function updateOptions ({ options, dispatch, apollo }) {
  if (
    _.isNil(options) ||
    _.isNil(apollo) ||
    !options.every(option => _.has(option, 'address'))
  ) {
    console.error('Data: options misconfigured.')
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

    if (options.length === 1) console.info('[ ---- ] Requesting option')
    else console.info('[ ---- ] Requesting options')

    const initialized = await SDK.OptionBuilder.fromAddresses({
      client: apollo.engine,
      addresses: options.map(option => option.address),
      networkId: apollo.networkId
    })

    if (initialized && initialized.length) {
      dispatch(
        initialized.map(option => [
          option.address,
          {
            element: {
              isLoading: false,
              value: option
            }
          }
        ]),
        'MULTI_DEEP_UPDATE'
      )
    } else throw new Error('option could not be found.')
  } catch (error) {
    console.error('Data:', error)

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

export async function updateOption ({ option, dispatch, apollo }) {
  if (_.isNil(option) || _.isNil(apollo) || !_.has(option, 'address')) {
    console.error('Data: option misconfigured.')
    return
  }

  return updateOptions({
    options: [option],
    dispatch,
    apollo
  })
}

export async function updateHelper ({ apollo, provider, signer, set }) {
  if (_.isNil(apollo) || _.isNil(provider) || _.isNil(signer)) {
    console.error('Data: provider or apollo misconfigured.')
    return
  }

  try {
    const helper = await SDK.HelperBuilder.resolve({
      client: apollo.engine,
      provider
    })

    set(helper)
  } catch (e) {}
}
