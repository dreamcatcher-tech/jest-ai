import React from 'react'
import { render } from 'ink'
import App from './app.js'

const history = [
  { role: 'assistant', content: 'moooo' },
  { role: 'user', content: 'hi' },
]

render(<App priorHistory={[]} />, {
  exitOnCtrlC: true,
  patchConsole: true,
})
