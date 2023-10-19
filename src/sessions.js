import userName from 'git-user-name'
import process from 'process'
import fs from 'fs'
import assert from 'assert-fast'
const DIR = 'sessions'

export default class Sessions {
  #filename
  #flushedIndex = 0
  static create(filename) {
    const sessions = new Sessions()
    sessions.#filename = filename
    return sessions
  }
  load() {
    if (!this.#filename) {
      return []
    }
    try {
      fs.accessSync(this.#filename)
    } catch (err) {
      return []
    }
    try {
      const session = []
      const data = fs.readFileSync(this.#filename)
      const lines = data.toString().split('\n')
      for (const line of lines) {
        if (!line) {
          continue
        }
        try {
          session.push(JSON.parse(line))
        } catch (err) {
          // TODO make the AI parse the error offer corrections
        }
      }
      this.#flushedIndex = session.length
      return session
    } catch (err) {
      // TODO log the error somewhere for the user to receive comment on
      console.error(err)
      return []
    }
  }
  async flush(session) {
    assert(Array.isArray(session))
    assert(session.length)
    if (!this.#filename) {
      return
    }
    const lines = []
    if (this.#flushedIndex === 0) {
      await fs.promises.mkdir(DIR, { recursive: true })

      lines.push(`# chat session\n\n`)
      lines.push(`> started at ${new Date().toString()}\n`)
      lines.push('```')
    }

    for (let i = this.#flushedIndex; i < session.length; i++) {
      const item = session[i]
      lines.push(JSON.stringify(item))
    }
    await fs.promises.appendFile(this.#filename, lines.join('\n') + '\n')
    this.#flushedIndex = session.length
  }
}

export const generateFileName = () => {
  const cwd = process.cwd()
  const filename = `${cwd}/${DIR}/${userName()}.md`
  return filename
}
