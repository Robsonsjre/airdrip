https://airdrip.netlify.app

Streaming call options for core contributors.

DAOs main goal is to sustain the development and growth of their protocol. Traditionally startups align incentive between the shareholders and the contributors by extending stock options to their employees. This is now possible in DeFi by creating a call option using Pods contracts and streaming them using Sablier. 

The main difference between traditional stock options and DeFi token options is that there is a path to finding secondary market liquidity which is a lot faster than the traditional way.

## Packages :package:

We're maintaining this as a monorepo with multiple sub packages.

### Deployed Packages

| Package                                                   | Description                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| [`app`](/packages/app)               | Rockstar frontend, both for the Distributor and the Receiver       |
| [`contracts`](/packages/contracts)                   | Dripper Contracts and Call + Streaming Vaults                       |
| [`content`](/packages/content)                 | Research and Presentation                                       |
| [`shared`](/packages/shared) | Smart contracts to be shared across projects and packages |

### Ethereum Testnets

#### Kovan

| Name          | Description                      | Address                                                                                                                     |
| ------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dripper |   Created for managing the Stream positions  | [0x](https://kovan.etherscan.io/address/0x) |


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
