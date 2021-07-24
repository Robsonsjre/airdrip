import { ENVIRONMENT, networks } from './atoms'

const production = {
  [networks.mainnet]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.kovan]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.matic]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.mumbai]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.local]: {
    manager: '',
    options: [],
    archive: []
  }
}

const development = {
  [networks.mainnet]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.kovan]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.matic]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.mumbai]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.local]: {
    manager: '',
    options: [],
    archive: []
  }
}

export const addresses = ENVIRONMENT.isProduction() ? production : development
