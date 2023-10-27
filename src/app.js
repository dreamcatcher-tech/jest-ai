import { useState, useCallback, useEffect } from 'react'
import { Box, Text } from 'ink'
import History from './history.js'
import TextInput from 'ink-text-input'
import Permanent from './permanent.js'
import AI from './ai.js'
import { generateFileName } from './disk.js'

export default function App() {
  const [ai, setAI] = useState()
  const [prompt, setPrompt] = useState()
  const [history, setHistory] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [unsubmitted, setUnsubmitted] = useState()
  useEffect(() => {
    const session = generateFileName()
    const ai = AI.create({ session })
    const unsubmitted = ai.popUnsubmitted()
    if (unsubmitted) {
      setPrompt(unsubmitted.content)
      setUnsubmitted(unsubmitted)
    }
    setAI(ai)
    setHistory(ai.session)
  }, [])
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

  useEffect(() => {
    if (unsubmitted) {
      setUnsubmitted()
      onSubmit()
    }
  }, [unsubmitted, onSubmit])

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
