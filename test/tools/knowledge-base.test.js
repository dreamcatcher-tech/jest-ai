import path from 'path'
import AI from '../../src/ai.js'
import { generateFileName } from '../../src/disk.js'
import fs from 'fs/promises'

/**
 * Tool to inflate bot definitions with knowledge base articles.
 * The key feature is that it uses gpt4 to determine what the
 * format that the user used is.
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
