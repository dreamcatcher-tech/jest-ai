import { render } from 'ink'
import App from './app.js'
import Debug from 'debug'
Debug.enable('ai')

render(<App />, {
  exitOnCtrlC: true,
  patchConsole: true,
})
