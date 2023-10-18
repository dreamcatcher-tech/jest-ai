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
  const [isThinking, setIsThinking] = useState(false)
  useInput((input, key) => {
    // console.log('input', input, 'key', key)
  })
  const onSubmit = useCallback(async () => {
    if (isThinking) {
      return
    }
    setIsThinking(true)
    setPrompt('')
    let historyNext = [
      ...history,
      { role: 'user', content: prompt },
      { role: 'assistant', content: 'thinking...', isStreaming: true },
    ]
    setHistory(historyNext)

    const stream = []
    for await (const result of ai.stream(prompt, history)) {
      stream.push(result)
      historyNext = [...historyNext]
      historyNext[historyNext.length - 1].content = stream.join('')
      setHistory(historyNext)
    }
    historyNext = [...historyNext]
    delete historyNext[historyNext.length - 1].isStreaming
    setHistory(historyNext)
    setIsThinking(false)
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
