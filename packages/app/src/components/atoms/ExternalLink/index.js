import _ from 'lodash'
import React from 'react'

export default function ExternalLink ({
  children,
  target = '_blank',
  ...props
}) {
  if (_.isNil(_.get(props, 'href')) && !_.isNil(_.get(props, 'to'))) { props.href = props.to }

  return (
    <a {...props} target={target} rel='noopener noreferrer'>
      {children}
    </a>
  )
}
