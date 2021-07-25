import _ from 'lodash'

export async function resolveAddressToENS (address, provider) {
  try {
    if (_.isNilOrEmptyString(address) || _.isNil(provider)) return null

    const sanitized = _.toString(address).toLowerCase()
    const name = await provider.lookupAddress(sanitized)

    return name
  } catch (e) {
    return null
  }
}
