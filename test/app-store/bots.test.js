import AI from '../../src/ai.js'
import Debug from 'debug'
const debug = Debug('test')
/**
 * Pulls in a bot definition from the library of bots
 * Loads it up on the prompt
 * May include a previous session that had occured ?
 */

describe('bots', () => {
  it.only('loads up a bot', async () => {
    const bot = 'helper'
    const ai = AI.create()
    await ai.setBot(bot)
    expect(ai.session.length).toEqual(1)
    const reply = 'Its nanya.'
    ai['@inject'](reply)
    const actual = await ai.prompt('what is the dreamcatcher, in a tweet ?')
    debug('actual', actual)
  })
  it.todo('loads from a glob pattern')
  it.todo('errors if the knowledge item cannot be found')
  it.todo('switches a bot part way thru a session')
  // this can be done using a test file that compares the response
  // alone, or with the prior prompts as well
  // may replace the bot with a good summary of what the bot does
})

// need to make a bot loader tool that gives feedback on the
// formatting that people have done with the bot, like a bot
// debugger, so they can get their prompts right and the format
// right.
