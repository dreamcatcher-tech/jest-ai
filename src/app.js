import React, { useState, useCallback, useEffect } from 'react'
import { useInput, Box, Text, Static } from 'ink'
import History from './history.js'
import { TextInput } from '@inkjs/ui'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import AI from './ai.js'

export default function App({ priorHistory = [] }) {
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState(priorHistory)

  useInput((input, key) => {
    // console.log('input', input, 'key', key)
  })
  const [ai, setAI] = useState()
  const [stream, setStream] = useState('')
  const onSubmit = useCallback(async () => {
    // generate an id, then store a text item showing history of chat
    const stream = []
    for await (const result of ai.stream(prompt)) {
      stream.push(result)
      setStream(stream.join(''))
    }
    setHistory([...history, { role: 'assistant', content: stream }])
  }, [prompt, ai])
  useEffect(() => {
    const ai = AI.create()
    setAI(ai)
  }, [])
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
          value={prompt}
          onChange={setPrompt}
          onSubmit={onSubmit}
          placeholder=" (messy genius goes here)"
        />
      </Box>
    </Box>
  )
}
