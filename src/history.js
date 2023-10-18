import React from 'react'
import { Box, Text } from 'ink'
import assert from 'assert-fast'

// put in a topic badge so we can show what the AI is goaled to
const GPT = ({ contents }) => {
  return (
    <Box flexDirection="row">
      <Text minWidth={3} color="green">
        🦾:&nbsp;
      </Text>
      <Text>{contents}</Text>
    </Box>
  )
}
const Solver = ({ contents }) => {
  return (
    <Box flexDirection="row">
      <Text minWidth={3} color="magenta">
        💡:&nbsp;
      </Text>
      <Text>{contents}</Text>
    </Box>
  )
}

export default function History({ history = [] }) {
  assert(Array.isArray(history))
  return (
    <Box flexDirection="column">
      {history.map((item, index) => (
        <Item {...item} key={index} />
      ))}
    </Box>
  )
}

export const Item = ({ role, content }) => {
  switch (role) {
    case 'assistant':
      return <GPT contents={content} />
    case 'system':
      return <Text>🤖: {content}</Text>
    case 'user':
      return <Solver contents={content} />
    default:
      return <Text>🤷‍♂️: {content}</Text>
  }
}
