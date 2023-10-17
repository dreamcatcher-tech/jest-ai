import React, { useState, useCallback, useEffect } from 'react'
import { useInput, Box, Text, Static } from 'ink'
import History from './history.js'
import TextInput from 'ink-text-input'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import AI from './ai.js'

export default function App({ priorHistory = [] }) {
  const [prompt, setPrompt] = useState()
  const [history, setHistory] = useState(priorHistory)

  useInput((input, key) => {
    // console.log('input', input, 'key', key)
  })
  const [ai, setAI] = useState()
  const onSubmit = useCallback(async () => {
    setPrompt('')
    let index = 0
    setHistory((history) => {
      const next = [
        ...history,
        { role: 'user', content: prompt },
        { role: 'assistant', content: 'thinking...' },
      ]
      index = next.length - 1
      return next
    })

    const stream = []
    for await (const result of ai.stream(prompt, history)) {
      stream.push(result)
      setHistory((history) => {
        const next = [...history]
        next[index].content = stream.join('')
        return next
      })
    }
  }, [prompt, history, ai])
  useEffect(() => {
    const ai = AI.create()
    setAI(ai)
  }, [])
  const placeholder = prompt === undefined ? ' (messy genius goes here)' : ''
  return (
    <Box flexDirection="column">
      <Static items={[{}]}>
        {(_, index) => (
          <Box key={index}>
            <Gradient name="rainbow">
              <BigText font="chrome" text="dreamcatcher.ai" />
            </Gradient>
          </Box>
        )}
      </Static>
      <History history={history} />
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
  )
}
