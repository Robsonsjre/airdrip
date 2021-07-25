import _ from 'lodash'
import React, { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import SDK from '@pods-finance/sdk'
import { useToasts } from 'react-toast-notifications'
import { ReactComponent as Diamond } from '../../../assets/decorators/diamond.svg'
import { Label, Input } from '../../shared/Form'
import { Button } from '../../atoms'
import { useWeb3Utilities } from '../../../hooks'
import reducers from '../../../reducers'
import { macros } from '../../../constants'
import { SpecialButton } from '../../../components/shared'

import { Contract } from 'ethers'
const abi = [
  {
    inputs: [
      {
        internalType: 'contract IConfigurationManager',
        name: '_configurationManager',
        type: 'address'
      },
      {
        internalType: 'contract ISablier',
        name: '_sablier',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'MIN_GAP_TIME',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'configurationManager',
    outputs: [
      {
        internalType: 'contract IConfigurationManager',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20Metadata',
        name: 'underlyingAsset',
        type: 'address'
      },
      {
        internalType: 'contract IERC20Metadata',
        name: 'strikeAsset',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'campaignAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'strikePrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'expiration',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256'
      }
    ],
    name: 'createCampaign',
    outputs: [
      {
        internalType: 'uint256',
        name: 'vaultId',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextVaultId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'sablier',
    outputs: [
      {
        internalType: 'contract ISablier',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'vaults',
    outputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'option',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
const address = '0x635E8f47B67Ddc9a94251ff9F3743E37a7fbbB9b'
const sushi = '0x82e358324C91d6360d08Da5f85c63C6d131955C8'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  justify-content: center;
`

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.sizes.canvasMaxWidth};
`

const Title = styled.h2`
  font-size: 20pt;
  margin: 0 0 30px 0;
  color: ${props => props.theme.colors.white};
`
const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 40px auto;
  & > svg {
    height: 26px;
    width: 26px;
    opacity: 0.8;
  }
`
const Divider = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${props => props.theme.colors.tint(20)};
`

const Playground = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 15px;
`

const Item = styled.div`
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  &[data-button='true'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    grid-gap: 15px;
    & > * {
      width: auto;
    }
  }
  &[data-amount='true'] {
    grid-column: span 2;
  }
`

async function init ({ elements, dispatch }) {
  dispatch([
    elements.underlying,
    { value: '0x82e358324C91d6360d08Da5f85c63C6d131955C8' }
  ])

  dispatch([
    elements.strike,
    { value: '0xe22da380ee6b445bb8273c81944adeb6e8450422' }
  ])
}

async function doCreate ({ state, signer, addToast }) {
  console.log(state)
  if (
    _.isNilOrEmptyString(_.get(state, 'underlying.value')) ||
    _.isNilOrEmptyString(_.get(state, 'strike.value')) ||
    _.isNilOrEmptyString(_.get(state, 'price.value')) ||
    _.isNilOrEmptyString(_.get(state, 'expiration.value')) ||
    _.isNilOrEmptyString(_.get(state, 'start.value')) ||
    _.isNilOrEmptyString(_.get(state, 'end.value')) ||
    _.isNilOrEmptyString(_.get(state, 'amount.value'))
  ) {
    addToast('Please fill in the entire form.', {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 5000
    })
  }

  const body = {
    underlyingAsset: _.toString(_.get(state, 'underlying.value')).toLowerCase(),
    strikeAsset: _.toString(_.get(state, 'strike.value')).toLowerCase(),
    campaignAmount: new BigNumber(_.get(state, 'amount.value'))
      .multipliedBy(
        new BigNumber(10).pow(18) // SUSHI
      )
      .toFixed(0)
      .toString(),
    strikePrice: new BigNumber(_.get(state, 'price.value'))
      .multipliedBy(
        new BigNumber(10).pow(6) // USDC
      )
      .toFixed(0)
      .toString(),
    expiration: _.get(state, 'expiration.value'),
    startTime: _.get(state, 'start.value'),
    endTime: _.get(state, 'end.value')
  }

  console.log(body)

  const contract = new Contract(address, abi, signer)

  try {
    const transaction = await contract.createCampaign(
      body.underlyingAsset,
      body.strikeAsset,
      body.campaignAmount,
      body.strikePrice,
      body.expiration,
      body.startTime,
      body.endTime
    )

    await transaction.wait()
    addToast('Congrats!', {
      appearance: 'success',
      autoDismiss: true,
      autoDismissTimeout: 5000
    })
  } catch (error) {
    console.error(error)
    addToast('Error at sending transaction.', {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 5000
    })
  }
}

function Create () {
  const { elements, state, dispatch } = reducers.create.useReducer()
  const { addToast } = useToasts()
  const { provider, signer } = useWeb3Utilities()

  const token = useMemo(() => {
    return new SDK.Token({
      address: sushi,
      networkId: 42,
      symbol: 'SUSHI',
      decimals: new BigNumber(88)
    })
  }, [])

  useEffect(() => {
    init({ dispatch, elements })
  }, [dispatch, elements])

  return (
    <Wrapper>
      <Container>
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
        <Title>Create a new campaign</Title>
        <Playground>
          <Item>
            <Label>Underlying asset address</Label>
            <Input.Text
              {...state.underlying}
              placeholder='e.g. 0x123...'
              onChange={e => {
                dispatch([
                  elements.underlying,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Strike asset address</Label>
            <Input.Text
              {...state.strike}
              placeholder='e.g. 0x456...'
              onChange={e => {
                dispatch([
                  elements.strike,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Strike price in $</Label>
            <Input.Amount
              {...state.price}
              placeholder='e.g. 2000'
              onChange={e => {
                dispatch([
                  elements.price,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Expiration date</Label>
            <Input.Amount
              {...state.expiration}
              placeholder='e.g. Expiration date in seconds'
              onChange={e => {
                dispatch([
                  elements.expiration,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>Start of stream</Label>
            <Input.Amount
              {...state.start}
              placeholder='e.g. Start date of stream'
              onChange={e => {
                dispatch([
                  elements.start,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item>
            <Label>End of stream</Label>
            <Input.Amount
              {...state.end}
              placeholder='e.g. End date of stream'
              onChange={e => {
                dispatch([
                  elements.end,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item data-amount>
            <Label>Campaign Amount</Label>
            <Input.Amount
              {...state.amount}
              placeholder='e.g. 100000'
              onChange={e => {
                dispatch([
                  elements.amount,
                  {
                    value: _.get(e, 'target.value')
                  }
                ])
              }}
            />
          </Item>
          <Item data-button>
            <SpecialButton.AllowToken
              amount={10000000}
              title='Allow SUSHI'
              isAllowed={false}
              isLoading={false}
              onApprove={() => {
                token.doAllow({
                  signer,
                  spender: address,
                  amount: new BigNumber(macros.ARBITRARILY_HIGH_APPROVAL_AMOUNT)
                })
              }}
            />

            <Button
              title='Create token campaign'
              appearance={a => a.gradient}
              accent={a => a.primary}
              type={t => t.button}
              onClick={() => {
                doCreate({ state, addToast, signer, provider })
              }}
            />
          </Item>
        </Playground>
        <Row />
        <Row>
          <Divider />
          <Diamond />
          <Divider />
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Create
