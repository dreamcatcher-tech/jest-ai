import test from 'ava'
import { render } from 'ink-testing-library'
import App from '../../src/app.js'

test.todo('initial session layout')
test('after some interactions', async (t) => {
  const { stdin } = render(<App />)
  stdin.write('to be, or not to be...')
  t.pass()
})
test('with history', async (t) => {
  const history = []
  const { lastFrame, stdin } = render(<App history={history} />)
  stdin.write('to be, or not to be...')
  console.log('lastFrame', lastFrame())
  t.pass()
})
