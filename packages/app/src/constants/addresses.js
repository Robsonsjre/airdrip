import { ENVIRONMENT, networks } from './atoms'

const production = {
  [networks.mainnet]: {
    manager: '',
    options: [],
    archive: []
  },
  [networks.kovan]: {
    manager: '0x11dB0eDFe06Cd06C9AFE96b9813043e0853e7926',
    options: [
      '0xa2Ac6463dC1Ef5541B1118F7E11e5733D419c131',
      '0xc34014836ccfac1e372a5da57204878b4f5fcdb5'
    ],
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
    manager: '0x11dB0eDFe06Cd06C9AFE96b9813043e0853e7926',
    options: [
      '0xa2Ac6463dC1Ef5541B1118F7E11e5733D419c131',
      '0xc34014836ccfac1e372a5da57204878b4f5fcdb5'
    ],
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
