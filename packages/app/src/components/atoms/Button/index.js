import _ from 'lodash'
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css, useTheme } from 'styled-components'
import { Link } from 'react-router-dom'
import { darken } from 'polished'

import Spinner from '../Spinner'

import Title from './Title'
import { types, useDesigner } from './designer'

const wrapperCss = css`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.dark};
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  min-height: 20px;
  padding: 16px 30px;
  position: relative;

  ${props =>
    props.shared.isDisabled &&
    css`
      cursor: not-allowed;
      filter: grayscale(100%);
      opacity: 0.5;
      user-select: none;
      &:active {
        pointer-events: none;
      }
    `}

  ${props =>
    (props.shared.isDisabledSoft || props.isLoading) &&
    css`
      cursor: not-allowed !important;
      user-select: none;
      pointer-events: none;
      &:active {
        pointer-events: none;
      }
    `}

    ${props =>
      props.shared.isClickAllowedOnDisabled &&
      css`
        pointer-events: all !important;
        &:hover,
        &:active {
          pointer-events: all !important;
        }
      `}

  ${props =>
    props.shared.isMini &&
    css`
      min-height: 30px;
      padding: 10px 20px;
    `};

  ${props =>
    props.shared.isFullWidth &&
    css`
      width: 100%;
    `};

  ${props => props.theme.medias.small} {
    padding: 20px 36px;
  }

 ${props => {
   const { design } = props.shared

   const color = css`
     color: ${_.get(design, 'color') || props.theme.white};
     &:hover,
     &:active,
     &[data-loading='true'] {
       ${_.has(design, 'colorHover') &&
         `color: ${_.get(design, 'colorHover')}; transition: color 200ms;`}
     }
   `

   switch (design.appearance) {
     case types.button.appearance.outline:
     case types.button.appearance.transparent:
     case types.button.appearance.solid:
       return css`
         ${color}
         ${design.border && `border: 1px solid ${design.border};`}
         ${design.shadow && `box-shadow: ${design.shadow};`}
         ${design.background && `background: ${design.background};`}
         transition: background 200ms, box-shadow 200ms, border 200ms, color 200ms;
         &:hover, &:active, &[data-loading="true"]  {
          ${design.borderHover && `border: 1px solid ${design.borderHover};`}
           ${design.shadowHover && `box-shadow: ${design.shadowHover};`}
           ${(_.get(design, 'backgroundHover') &&
             `background: ${design.backgroundHover};`) ||
             (_.get(design, 'background') &&
               `background: ${darken(0.1, design.background)};`)}
            transition: background 200ms, box-shadow 200ms, border 200ms, color 200ms;
         }
       `
     case types.button.appearance.gradient:
       return css`
         ${color}
         ${design.border && `border: 1px solid ${design.border};`}
         ${design.shadow && `box-shadow: ${design.shadow};`}
         ${design.background && `background: ${design.background};`}
         background-position-y: 0%;
         background-position-x: 0%;
         background-size: 100% 100%;
         transition: background-size 200ms, background 200ms, box-shadow 200ms, border 200ms, color 200ms;

         &:hover,
         &:active,
         &[data-loading='true'] {
           background-size: 200% 100%;
           transition: background-size 200ms, background 200ms, box-shadow 200ms, border 200ms, color 200ms;


           ${design.borderHover && `border: 1px solid ${design.borderHover};`}
           ${design.shadowHover && `box-shadow: ${design.shadowHover};`}
           ${design.backgroundHover && `background: ${design.backgroundHover};`}



         }
         ${props.shared.isLoading &&
           css`
             background-size: 200% 100%;
             transition: background-size 200ms;
           `}

       `
     default:
       return css``
   }
 }};
`

const LinkWrapper = styled.a`
  ${wrapperCss};
`

const ButtonWrapper = styled.div`
  ${wrapperCss};
`

const LoaderWrapper = styled.div`
  position: relative;
  height: 10px;
  width: 0;
  & > div {
    position: absolute;
    position: relative;
    top: -5px;
  }

  &:not([data-position='left']) {
    order: 1000;
    & > div {
      right: 5px;
    }
    ${props => props.theme.medias.small} {
      right: 2px;
    }
  }
  &[data-position='left'] {
    order: -1;
    & > div {
      left: -10px;
    }
    ${props => props.theme.medias.small} {
      width: 20px;
      right: -6px;
    }
  }
`

/**
 *
 * @param {string} title
 */
function Button ({
  accent: rawAccent,
  appearance: rawAppearance,
  cast,
  className,
  children,
  childrenLeft,
  childrenRight,
  isDisabled,
  isDisabledSoft,
  isFullWidth,
  isLoading,
  isMini,
  isClickAllowedOnDisabled,
  onClick,
  target,
  title,
  titleMedium,
  titleShort,
  to,
  type: rawType,
  ...otherProps
}) {
  const theme = useTheme()

  const appearance = useMemo(
    () =>
      _.isFunction(rawAppearance)
        ? rawAppearance(types.button.appearance, theme.isDark)
        : _.toString(rawAppearance),
    [rawAppearance, theme]
  )
  const accent = useMemo(
    () =>
      _.isFunction(rawAccent)
        ? rawAccent(types.button.accent, theme.isDark)
        : _.toString(rawAccent),
    [rawAccent, theme]
  )
  const type = useMemo(
    () =>
      _.isFunction(rawType) ? rawType(types.button.type) : _.toString(rawType),
    [rawType]
  )

  const design = useDesigner(accent, appearance)

  const sharedProps = {
    design,
    isDisabled,
    isDisabledSoft,
    isFullWidth,
    isLoading,
    isMini,
    isClickAllowedOnDisabled
  }
  const titleProps = {
    title,
    design,
    titleMedium,
    titleShort,
    isMini
  }

  const renderLoader = useCallback(() => {
    return isLoading ? (
      <LoaderWrapper
        {...otherProps}
        data-component='loader'
        data-position={isLoading}
      >
        <div>
          <Spinner
            color={
              _.get(design, 'colorHover') || _.get(design, 'color') || '#ffffff'
            }
          />
        </div>
      </LoaderWrapper>
    ) : (
      <></>
    )
  }, [isLoading, otherProps, design])

  const renderBody = useCallback(
    parent => {
      return (
        <>
          {isLoading && isLoading === 'left' ? null : childrenLeft}
          <Title {...titleProps} design={design} parent={parent} />
          {isLoading === true || isLoading === 'right' ? null : childrenRight}
          {renderLoader()}
        </>
      )
    },
    [childrenLeft, childrenRight, design, titleProps, renderLoader, isLoading]
  )

  const onFinalClick = useCallback(
    e => {
      if ((isDisabled || isDisabledSoft) && !isClickAllowedOnDisabled) {
        e.preventDefault()
      } else {
        onClick(e)
      }
    },
    [isDisabled, isDisabledSoft, onClick, isClickAllowedOnDisabled]
  )

  switch (type) {
    case types.button.type.external:
      return (
        <LinkWrapper
          data-disabled={isDisabled || isDisabledSoft}
          data-loading={isLoading}
          className={className}
          shared={sharedProps}
          href={to}
          onClick={onFinalClick}
          rel='noopener noreferrer'
          target={target}
        >
          {renderBody(LinkWrapper)}
        </LinkWrapper>
      )
    case types.button.type.router:
      return (
        <ButtonWrapper
          data-disabled={isDisabled || isDisabledSoft}
          data-loading={isLoading}
          className={className}
          shared={sharedProps}
          as={Link}
          to={to}
          onClick={onFinalClick}
        >
          {renderBody(ButtonWrapper)}
        </ButtonWrapper>
      )
    case types.button.type.button:
    default:
      return (
        <ButtonWrapper
          as={cast}
          data-disabled={isDisabled || isDisabledSoft}
          data-loading={isLoading}
          className={className}
          shared={sharedProps}
          onClick={onFinalClick}
        >
          {renderBody(ButtonWrapper)}
        </ButtonWrapper>
      )
  }
}

Button.propTypes = {
  /**
   * Returns the chosen type from the list of available types
   * @name ValueGenerator
   * @function
   * @param {object} t Source object of types
   * @returns {string} Type
   */

  /**
   * @param {string|ValueGenerator} accent The primary color or accent of the button design.
   * Either a string or a function that will receive the possible types as an argument and return the chosen value.
   */
  accent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(Object.keys(types.button.accent))
  ]),

  /**
   * @param {string|ValueGenerator} appearance The shape given to the button design.
   * Either a string or a function that will receive the possible types as an argument and return the chosen value.
   */
  appearance: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(Object.keys(types.button.appearance))
  ]),
  /* In cases where the button has a decorator (e.g. Link) we might want to cast the container obhect to *as* */
  cast: PropTypes.string,
  childrenLeft: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  /**
   * @param {object} className Additional classNames for out-of-scope styling
   */
  childrenRight: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDisabledSoft: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isMini: PropTypes.bool,
  isClickAllowedOnDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  target: PropTypes.string,
  /**
   * @param {string|object} title Default title for the button
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * @param {string|object} titleShort Adaptation of the title for small screens. Empty string will hide the title on small screens
   */
  titleShort: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * @param {string|object} titleMedium Adaptation of the title for medium screens. Empty string will hide the title on medium screens
   */
  titleMedium: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  to: PropTypes.string,
  /**
   * @param {string|ValueGenerator} type The type/behaviour of the button (router, _blank anchor, ...)
   * Either a string or a function that will receive the possible types as an argument and return the chosen value.
   */
  type: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(Object.keys(types.button.type))
  ])
}

Button.defaultProps = {
  accent: types.button.accent.primary,
  appearance: types.button.appearance.outline,
  cast: null,
  childrenLeft: <span />,
  childrenRight: <span />,
  className: null,
  isDisabled: false,
  isDisabledSoft: false,
  isFullWidth: false,
  isLoading: false,
  isMini: false,
  isClickAllowedOnDisabled: false,
  onClick: () => {},
  target: '_blank',
  title: '',
  titleShort: null,
  titleMedium: null,
  to: '',
  type: types.button.type.button
}

export default Button
