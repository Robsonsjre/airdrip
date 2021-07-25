import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Spinner } from '../../../../atoms'

const WrapperPartial = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  &[data-disabled='true'] {
    cursor: not-allowed;
  }
`

const Title = styled.p`
  font-size: 12pt;
  font-weight: 700;
  color: ${props => props.theme.colors.white} !important;
  padding: 0 ${props => props.theme.sizes.edge};
  margin: 0;
  &[data-advanced='true'] {
    &:before {
      content: 'Advanced: ';
      color: ${props => props.theme.colors.middle};
      font-size: 12pt;
      font-weight: 700;
    }
  }
`

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 600;
  background-image: linear-gradient(
    -90deg,
    ${props => props.theme.colors.platform},
    ${props => props.theme.colors.white}
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 250ms;
`

const Content = styled.div`
  margin-top: calc(${props => props.theme.sizes.edge} * 3 / 2);
  margin-left: ${props => props.theme.sizes.edge};
  width: calc(100% - 2 * ${props => props.theme.sizes.edge});
  position: relative;
  overflow: hidden;
  &[data-contained='true'] {
    border-radius: calc(${props => props.theme.sizes.edge} * 1 / 2);
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.platform};
    padding: calc(${props => props.theme.sizes.edge} * 3 / 2);
  }

  &[data-loading='true'] {
    pointer-events: none;
    ${Loader} {
      opacity: 1;
      transition: opacity 250ms;
    }
  }
  &[data-disabled='true'] {
    pointer-events: none;
  }
`

const Wrapper = styled(WrapperPartial)`
  ${props => props.theme.medias.medium} {
    ${Content} {
      &[data-contained='true'] {
        padding: calc(${props => props.theme.sizes.edge} * 1);
      }
    }

    &:last-child {
      padding-bottom: calc(${props => props.theme.sizes.edge} * 1);
    }
  }
  ${props => props.theme.medias.small} {
    ${Content} {
      p[data-component='token-label'] {
        display: none;
      }
      &[data-contained='true'] {
        border-radius: 0;
        margin-left: 0;
        width: 100%;
      }
    }
  }
`

function Section ({
  children,
  className,
  title,
  isAdvanced,
  isContained,
  isLoading,
  isDisabled
}) {
  return (
    <Wrapper className={className} data-disabled={isDisabled}>
      <Title data-advanced={isAdvanced}>{title}</Title>
      <Content
        data-contained={isContained}
        data-loading={isLoading}
        data-disabled={isDisabled}
      >
        <Loader>
          <Spinner size={40} thickness={1.8} color={c => c.border} />
        </Loader>
        {children}
      </Content>
    </Wrapper>
  )
}

Section.propTypes = {
  title: PropTypes.string,
  isAdvanced: PropTypes.bool,
  isContained: PropTypes.bool,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool
}

Section.defaultProps = {
  title: 'Section',
  isAdvanced: false,
  isContained: false,
  isLoading: false,
  isDisabled: false
}

export default Section
