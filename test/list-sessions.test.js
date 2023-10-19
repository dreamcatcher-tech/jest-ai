import path from 'path'
import test from 'ava'
import AI from '../src/ai.js'
import fs from 'fs/promises'

/**
 * Describes how to store the user sessions in a text file.
 * Pulls the name from the git repo.
 * Stores in jsonl files, one per session.
 * Indicates changes it made to systems based on function calls and params
 * Uses an icon with some flags to indicate extra substeps the machine took
 */
import userName from 'git-user-name'
import process from 'process'
const generateFileName = () => {
  const cwd = process.cwd()
  const now = new Date()
  const rand = '' + now.getHours() + now.getMinutes() + '_' + now.getSeconds()
  const filename = `${cwd}/chats/${userName()}_${rand}.jsonl`
  return filename
}

test.before(async (t) => {
  await fs.mkdir('tmp', { recursive: true })
  const tmp = await fs.mkdtemp('tmp/session-test-')
  const baseFilename = generateFileName()
  const name = path.basename(baseFilename)
  t.context = { tmp, filename: path.join(tmp, name) }
})
test.after.always(async (t) => {
  const path = t.context.tmp.substring(4)
  console.log('removing', path)
  await fs.rmdir(path, { recursive: true })
})

test.only('store a session in a file', async (t) => {
  const { filename } = t.context
  console.log('filename', filename)

  const ai = AI.create(filename)
  const reply = await ai.prompt('call me bob')
  console.log('reply', reply)

  t.assert(await fs.stat(filename))
  t.is(ai.session.length, 2)

  const reload = AI.create(filename)
  t.deepEqual(reload.session, ai.session)

  // read in the file to check its contents

  // apply the rename function if the ai has enough confidence
  // build in the loop that if the format fails, it sends it back
  // to get corrected - this is the fundamental self checking

  // this can be renamed once the conversation progresses

  // open the session as a file in some location
  // interact with the prompt
  // observe it writing to file each time
  // close the file when the session ended - how ?
  // when it loads
})
test.todo('load a session from a file')
test.skip('rerun a session using the appraiser', async (t) => {
  // this would be done generating choices, and then appraising them
})
test.skip('load up a session in the target window', async (t) => {
  // this would load up a bot designed for working with these files
  // it would be able to run the session live in the appraiser.
  // and show the results
})
