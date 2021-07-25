import React from 'react'
import PropTypes from 'prop-types'

const Emoji = ({ label, symbol }) => {
  return (
    <span data-component='emoji' role='img' aria-label={label} aria-hidden={label}>
      {symbol}
    </span>
  )
}

Emoji.propTypes = {
  label: PropTypes.string,
  symbol: PropTypes.string.isRequired
}
Emoji.defaultProps = {
  label: null
}

export default Emoji
