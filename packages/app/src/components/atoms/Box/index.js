import styled from 'styled-components'

const Box = styled.div`
  border-radius: ${props => props.theme.sizes.baseRadius};
  background-color: ${props => `#ffffff${props.tint || 10}`};
`

export default Box
