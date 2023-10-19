import path from 'path'
import AI from '../src/ai.js'
import { generateFileName } from '../src/sessions.js'
import fs from 'fs/promises'

/**
 * Describes how to store the user sessions in a text file.
 * Pulls the name from the git repo.
 * Stores in jsonl files, one per session.
 * Indicates changes it made to systems based on function calls and params
 * Uses an icon with some flags to indicate extra substeps the machine took
 *
 * Types of sessions:
 * 1. sessions with the colonel
 * 2. sessions with the appraiser, used in testing ?
 * 3. sessions used to program a bot
 * 4. sessions that were changed to be what we wanted back, used for appraisals
 * 5.
 *
 * base sessions
 * 1. agents: chats used to program a bot (human modified)
 * 2. sessions: chats that interact with a bot (unmodifiable)
 * 3. appraisals: chats used to appraise a bot (human modified)
 *
 * the trouble is that if you edit a session, loading makes less sense ?
 */

describe('list-sessions', () => {
  let filename

  beforeAll(async () => {
    await fs.mkdir('.tmp', { recursive: true })
    const tmp = await fs.mkdtemp('.tmp/session-test-')
    const baseFilename = generateFileName()
    filename = tmp + '/' + path.basename(baseFilename)
  })
  afterAll(async () => {
    const dir = path.dirname(filename)
    await fs.rmdir(dir, { recursive: true })
  })

  test.only('store a session in a file', async () => {
    const ai = AI.create(filename)
    await ai.prompt('call me bob')

    expect(await fs.stat(filename)).toBeTruthy()
    expect(ai.session.length).toEqual(2)

    const reload = AI.create(filename)
    expect(reload.session).toEqual(ai.session)

    // open the session as a file in some location
    // interact with the prompt
    // observe it writing to file each time
    // close the file when the session ended - how ?
    // when it loads
  })
  // test.todo('load a session from a file')
  // test.skip('rerun a session using the appraiser', async () => {
  //   // this would be done generating choices, and then appraising them
  // })
  // test.skip('load up a session in the target window', async () => {
  //   // this would load up a bot designed for working with these files
  //   // it would be able to run the session live in the appraiser.
  //   // and show the results
  // })
})
