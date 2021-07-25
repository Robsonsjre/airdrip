https://aidrip.netlify.app

## Packages :package:

We're maintaining this as a monorepo with multiple sub packages.

### Deployed Packages

| Package                                                   | Description                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| [`app`](/packages/app)               | Rockstar frontend, both for the Distributor and the Receiver       |
| [`contracts`](/packages/contracts)                   | Zap Contracts and Call + Streaming Vaults                       |
| [`content`](/packages/content)                 | Research and Presentation                                       |
| [`shared`](/packages/shared) | Smart contracts to be shared across projects and packages |

### Ethereum Testnets

#### Kovan

| Name          | Description                      | Address                                                                                                                     |
| ------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Vault |   Created for managing the Stream positions  | [0x](https://kovan.etherscan.io/address/0x) |
| Zap Creation       | Proxy used in our web interfaces | [0x7](https://kovan.etherscan.io/address/0x7) |


## Usage :hammer_and_pick:

### Contracts 
To compile the smart contracts, bootstrap the monorepo and open the package you'd like to work on. For example, here are the instructions for `contracts/contracts`:

```bash
$ yarn install
$ cd packages/contracts
$ npx hardhat compile
```
### Requirements

- yarn >=1.17.3
- hardhat >= 2.5.0
- solidity 0.8.x
