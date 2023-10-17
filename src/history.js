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
    <Box>
      {history.map(({ role, content }) => {
        switch (role) {
          case 'user':
            return <GPT contents={content} />
          case 'system':
            return <Solver contents={content} />
          default:
            return <Text>🤷‍♂️: {content}</Text>
        }
      })}
    </Box>
  )
  // check all the formats
  // return the list of components with contents as provided
  // switch between different agent boxes and flags
}
