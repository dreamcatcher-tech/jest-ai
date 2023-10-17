import React, { useState, useCallback } from 'react'
import { useInput, Box, Text, Static } from 'ink'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import History from './history.js'
import { TextInput } from '@inkjs/ui'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
dotenv.config()

const openai = new OpenAI()

export default function App({ priorHistory = [] }) {
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState(priorHistory)
  useInput((input, key) => {
    // console.log('input', input, 'key', key)
  })
  const onSubmit = useCallback(
    async (...args) => {
      // generate an id, then store a text item showing history of chat
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      })
      for await (const part of stream) {
        process.stdout.write(part.choices[0]?.delta?.content || '')
      }
    },
    [prompt],
  )
  return (
    <Box flexDirection="column">
      <Static items={[{}]}>
        {(image, index) => (
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
