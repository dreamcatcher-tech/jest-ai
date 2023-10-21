import path from 'path'
import AI from '../../src/ai.js'
import { generateFileName } from '../../src/disk.js'
import fs from 'fs/promises'
import Debug from 'debug'
/**
 * Pulls in a bot definition from the library of bots
 * Loads it up on the prompt
 * May include a previous session that had occured ?
 */

describe('bots', () => {
  let session

  beforeAll(async () => {
    await fs.mkdir('.tmp', { recursive: true })
    const tmp = await fs.mkdtemp('.tmp/session-test-')
    const baseFilename = generateFileName()
    session = tmp + '/' + path.basename(baseFilename)
  })
  afterAll(async () => {
    const dir = path.dirname(session)
    await fs.rmdir(dir, { recursive: true })
  })

  it.only('loads up a bot', async () => {
    Debug.enable('ai disk knowledge')
    // how to collapse the bot history ?
    // @bot(bot name) possibly with the git commit permalink

    // session loaded badge at the top of the history
    // let you rename the current session ?

    const bot = 'helper'
    const ai = AI.create({ session })
    await ai.setBot(bot)
    expect(ai.session.length).toEqual(1)
    const reply = 'Its nanya.'
    ai['@inject'](reply)
    const actual = await ai.prompt('what is the dreamcatcher ?')

    console.dir(ai.session, { depth: null })
    expect(actual).toEqual(reply)

    expect(await fs.stat(session)).toBeTruthy()
    expect(ai.session.length).toEqual(3)

    const reload = AI.create({ session, bot })
    expect(reload.session).toEqual(ai.session)
  })
  it.todo('loads from a glob pattern')
  it.todo('errors if the knowledge item cannot be found')
  it.todo('switches a bot part way thru a session')
  // this can be done using a test file that compares the response
  // alone, or with the prior prompts as well
  // may replace the bot with a good summary of what the bot does
})
