import React, { useState, useCallback, useEffect } from 'react'
import { useInput, Box, Text, Static } from 'ink'
import History from './history.js'
import TextInput from 'ink-text-input'
import Permanent from './permanent.js'
import AI from './ai.js'

export default function App({ priorHistory = [] }) {
  const ai = AI.create()
  const [prompt, setPrompt] = useState()
  const [history, setHistory] = useState(priorHistory)

  useInput((input, key) => {
    // console.log('input', input, 'key', key)
  })
  const onSubmit = useCallback(async () => {
    setPrompt('')
    let index
    setHistory((history) => {
      const next = [
        ...history,
        { role: 'user', content: prompt },
        { role: 'assistant', content: 'thinking...', isStreaming: true },
      ]
      index = next.length - 1
      return next
    })

    const stream = []
    for await (const result of ai.stream(prompt, history)) {
      stream.push(result)
      if (index === undefined) {
        continue
      }
      setHistory((history) => {
        const next = [...history]
        next[index].content = stream.join('')
        return next
      })
    }
    setHistory((history) => {
      const next = [...history]
      delete next[index].isStreaming
      return next
    })
  }, [prompt, history, ai])
  const placeholder = prompt === undefined ? ' (type, genius...)' : ''
  const [finished, streaming] = streamingFilter(history)
  return (
    <>
      <Permanent history={finished} />
      <Box flexDirection="column">
        <History history={streaming} />
        <Box marginRight={1} borderStyle="round">
          <Text>💡 </Text>
          <TextInput
            value={prompt || ''}
            onChange={setPrompt}
            onSubmit={onSubmit}
            placeholder={placeholder}
          />
        </Box>
      </Box>
    </>
  )
}

const streamingFilter = (history) => {
  const finished = []
  const streaming = []
  let isStreaming = false

  for (const item of history) {
    if (item.isStreaming) {
      isStreaming = true
      streaming.push(item)
    } else if (isStreaming) {
      streaming.push(item)
    } else {
      finished.push(item)
    }
  }

  return [finished, streaming]
}
