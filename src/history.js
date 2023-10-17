import React, { useEffect, useState, useCallback } from 'react'
import {
  render,
  useInput,
  useStdin,
  useApp,
  Box,
  Text,
  Static,
  useStdout,
  Newline,
} from 'ink'
import { TaskList, Task } from 'ink-task-list'
import cliSpinners from 'cli-spinners'
import assert from 'assert-fast'

// put in a topic badge so we can show what the AI is goaled to
const GPT = ({ contents }) => {
  return (
    <Box>
      <Text color="green">🦾: </Text>
      <Text>{contents}</Text>
    </Box>
  )
}
const Solver = ({ contents }) => {
  return (
    <Box>
      <Text color="magenta">💡: </Text>
      <Text>{contents}</Text>
    </Box>
  )
}

export default function History({ history = [] }) {
  assert(Array.isArray(history))
  return (
    <Box flexDirection="column">
      {history.map(({ role, content }, index) => {
        switch (role) {
          case 'assistant':
            return <GPT contents={content} key={index} />
          case 'system':
            return <Text key={index}>🤖: {content}</Text>
          case 'user':
            return <Solver contents={content} key={index} />
          default:
            return <Text key={index}>🤷‍♂️: {content}</Text>
        }
      })}
    </Box>
  )
  // check all the formats
  // return the list of components with contents as provided
  // switch between different agent boxes and flags
}
