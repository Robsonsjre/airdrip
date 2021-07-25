import _ from 'lodash'
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const TitleWrapperPartial = styled.div`
  z-index: 2;
`

const TitleLabel = styled.p`
  display: inline;
  font-size: 10pt;
  font-weight: 600;
  margin: 0px 2px;
  text-align: center;

  ${props => props.theme.medias.small} {
    display: none;
    margin: 0px 4px;
    font-size: 11pt;
  }
`

const MediumTitleLabel = styled(TitleLabel)`
  display: none;

  ${props => props.theme.medias.small} {
    display: inline;
  }

  ${props => props.theme.medias.small} {
    display: none;
  }
`

const ShortTitleLabel = styled(TitleLabel)`
  display: none;

  ${props => props.theme.medias.small} {
    display: inline !important;
  }
`

const TitleWrapper = styled(TitleWrapperPartial)`
  color: currentColor;

  ${props => props.parent} > * {
    color: currentColor;
  }

  ${props =>
    props.design.colorOverlay &&
    css`
      & > ${TitleLabel} {
        background: ${props => props.design.colorOverlay};
        background-size: 100%;
        background-position-x: 0;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `}

  &[data-mini="true"] > ${TitleLabel} {
    font-size: ${props => props.theme.sizes.buttonTitleMini};
    font-weight: 600;
  }
`

function Title ({ design, isMini, parent, title, titleMedium, titleShort }) {
  const renderTitleSizes = useCallback(() => {
    const valueM = !_.isNil(titleMedium) ? titleMedium : title
    const medium = !_.isNil(valueM) ? (
      <MediumTitleLabel>{valueM}</MediumTitleLabel>
    ) : null

    const valueS = !_.isNil(titleShort) ? titleShort : valueM
    const short = !_.isNil(valueS) ? (
      <ShortTitleLabel>{valueS}</ShortTitleLabel>
    ) : null

    return (
      <>
        {medium}
        {short}
      </>
    )
  }, [title, titleMedium, titleShort])

  return (
    <TitleWrapper
      design={design}
      parent={parent}
      data-component='title'
      data-mini={isMini}
    >
      <TitleLabel>{title}</TitleLabel>
      {renderTitleSizes()}
    </TitleWrapper>
  )
}

Title.propTypes = {
  design: PropTypes.shape({}).isRequired,
  isMini: PropTypes.bool,
  parent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  titleShort: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // empty string will hide the title on small screens
  titleMedium: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) // empty string will hide the title on medium screens
}

Title.defaultProps = {
  isMini: false,
  titleShort: null,
  titleMedium: null
}

export default Title
