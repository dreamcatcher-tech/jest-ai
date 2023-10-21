import path from 'path'
import AI from '../../src/ai.js'
import { generateFileName } from '../../src/disk.js'
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

describe('knowledge-base', () => {
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

  it('load up from a knowledge base', async () => {
    // figure out a links mechanism to
    // @knowledge:filenameInKnowledgeBase
    // but only in ram, so the sessions stay unchanged
    // they would show as a link in the UI
    // how would the user know it had been expanded ?
    const ai = AI.create(filename)
    const reply = 'hey, bob'
    ai['@inject'](reply)
    const actual = await ai.prompt('call me bob')
    expect(actual).toEqual(reply)

    expect(await fs.stat(filename)).toBeTruthy()
    expect(ai.session.length).toEqual(2)

    const reload = AI.create(filename)
    expect(reload.session).toEqual(ai.session)
  })
  it.todo('loads from a glob pattern')
  it.todo('errors if the knowledge item cannot be found')
  it.todo('loads the whole knowledge base with *')
  it.todo('loads only specific files')
  it.todo('loads from a nested path')
  it.todo('can correct a parsing error in json')
})
