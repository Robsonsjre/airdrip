import IconLock from '@material-ui/icons/LockOutlined'
import IconPending from '@material-ui/icons/WifiOffRounded'
import PropTypes from 'prop-types'
import React from 'react'
import { useToasts } from 'react-toast-notifications'
import { Button } from '../../../atoms'
import styled from 'styled-components'

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > svg {
    position: absolute;
    font-size: 14pt;
  }
`

function Transact ({
  title,
  warning,
  isLoading,
  isDisabled,
  isAllowed,
  isPending,
  onClick
}) {
  const toast = useToasts()

  if (isDisabled) {
    return (
      <Button
        title={title}
        appearance={a => (isAllowed ? a.gradient : a.outline)}
        accent={(a, c) => (c ? a.primary : a.darkAbsolute)}
        childrenLeft={
          <Left>
            <IconLock />
          </Left>
        }
        type={t => t.button}
        onClick={() => {
          toast.addToast(warning, {
            appearance: 'warning',
            autoDismiss: true,
            autoDismissTimeout: 10000
          })
        }}
        isFullWidth
        isDisabledSoft
        isClickAllowedOnDisabled
      />
    )
  }

  return (
    <Button
      title={title}
      appearance={a => a.gradient}
      accent={(a, c) => (c ? a.primary : a.dark)}
      childrenLeft={<Left>{isPending && <IconPending />}</Left>}
      type={t => t.button}
      onClick={onClick}
      isLoading={isLoading}
      isDisabled={isLoading || isDisabled}
      isFullWidth
    />
  )
}

Transact.propTypes = {
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isAllowed: PropTypes.bool,
  isPending: PropTypes.bool,
  warning: PropTypes.string
}

Transact.defaultProps = {
  title: null,
  isLoading: false,
  isAllowed: false,
  isDisabled: false,
  isPending: false,
  warning: 'Grant the allowances and make sure the data is valid.'
}

export default Transact
