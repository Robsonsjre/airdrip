/* eslint-disable react/prop-types */
import _ from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { DefaultToast, DefaultToastContainer } from 'react-toast-notifications'
import { useWindowSize } from '../../../hooks'
import Theme from '../../../themes'

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 4px;

  & > div {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    border-style: solid;
    border-width: 2px;
    border-color: ${props => props.theme.colors.secondary};
  }

  & > p {
    font-size: 11pt !important;
    font-weight: 600 !important;
    margin: 0 !important;
    padding-left: 8px !important;
  }
`

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${Header} {
    & > div {
      border-color: ${props => props.color} !important;
    }
    & > p {
      color: ${props => props.color} !important;
    }
  }
`

const TopDarkToastWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background-color: ${props => darken(0.05, props.theme.colors.dark)};
  border-radius: 8px;
  box-shadow: 0px 5px 15px -4px rgba(38, 41, 64, 0.4) !important;
  margin: 10px;
  width: calc(100% - 2 * 10px);
  overflow: hidden;
  pointer-events: all;

  p {
    text-align: left;
    margin: 0;
    font-size: 10pt;
    font-weight: 400;
    line-height: 1.4;
    padding-left: 18px;
  }
  p,
  svg,
  span {
    color: ${props => props.theme.colors.white};
  }
`

function TopDarkToast ({ appearance, children: c }) {
  const children = _.isString(c) ? <p>{c}</p> : c

  const [label, color] = useMemo(() => {
    switch (appearance) {
      case 'success':
        return ['Success', Theme.colors.green]
      case 'warning':
        return ['Warning', Theme.colors.yellow2]
      default:
        return ['Error', Theme.colors.red]
    }
  }, [appearance])

  return (
    <TopDarkToastWrapper data-appearance={appearance}>
      <Container color={color}>
        <Header>
          <div />
          <p>{label}</p>
        </Header>
        {children}
      </Container>
    </TopDarkToastWrapper>
  )
}

const Toast = React.forwardRef(
  ({ children, design, appearance, ...props }, ref) => {
    if (_.get(design) === 'default') {
      return (
        <DefaultToast appearance={appearance} {...props}>
          {children}
        </DefaultToast>
      )
    }
    return (
      <TopDarkToast forwardedRef={ref} appearance={appearance} {...props}>
        {children}
      </TopDarkToast>
    )
  }
)

export function ToastContainer (props) {
  const size = useWindowSize()
  const isMini = useMemo(() => size.width <= parseInt(Theme.sizes.deviceSM), [
    size
  ])

  const style = useMemo(
    () => ({
      zIndex: Theme.sizes.toastContainerElevation,
      top: 15,
      right: size.width ? 0 : 15,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'column',
      pointerEvents: 'none',
      width: isMini ? size.width - 20 : 260
    }),
    [isMini, size]
  )

  return <DefaultToastContainer {...props} style={style} />
}

export default {
  Element: Toast,
  Container: ToastContainer
}
