import userName from 'git-user-name'
import process from 'process'
import fs from 'fs'
import assert from 'assert-fast'
import Debug from 'debug'
import KnowledgeMatcher from './tools/knowledge-matcher.js'
const debug = Debug('disk')
const SESSIONS_DIR = 'sessions'
const BOTS_DIR = 'bots'
const KNOWLEDGE_DIR = 'knowledge'

export default class Disk {
  #session // the filename of the session to write to
  #flushedIndex = 0
  #knowledge = KnowledgeMatcher.create()
  static create(session) {
    assert(!session || typeof session === 'string')
    const sessions = new Disk(session)
    sessions.#session = session
    return sessions
  }
  async expand(session) {
    assert(Array.isArray(session))
    const withBots = []
    for (const item of session) {
      if (item.role === 'bot') {
        const bot = item.content
        await this.loadBot(bot)
        debug('prompts for', bot, this.#bots.get(bot))
        withBots.push(...this.#bots.get(bot))
      } else {
        withBots.push(item)
      }
    }

    return withBots
  }
  load() {
    if (!this.#session) {
      return []
    }
    try {
      fs.accessSync(this.#session)
    } catch (err) {
      return []
    }
    try {
      const session = []
      const data = fs.readFileSync(this.#session)
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
      // TODO check that expanding the session works correctly
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
    if (!this.#session) {
      return
    }
    const lines = []
    if (this.#flushedIndex === 0) {
      await fs.promises.mkdir(SESSIONS_DIR, { recursive: true })

      lines.push(`# chat session\n\n`)
      lines.push(`> started at ${new Date().toString()}\n`)
      lines.push('```')
    }

    for (let i = this.#flushedIndex; i < session.length; i++) {
      const item = session[i]
      lines.push(JSON.stringify(item))
    }
    await fs.promises.appendFile(this.#session, lines.join('\n') + '\n')
    this.#flushedIndex = session.length
  }
  #bots = new Map()
  async loadBot(bot) {
    if (!this.#bots.has(bot)) {
      assert(typeof bot === 'string')
      assert(!bot.startsWith('.'))
      assert(!bot.startsWith('/'))
      assert(!bot.endsWith('.md'))
      const filename = `${BOTS_DIR}/${bot}.md`
      const data = fs.readFileSync(filename)
      const lines = data.toString().split('\n')
      const botPrompts = []
      for (const line of lines) {
        if (!line) {
          continue
        }
        try {
          botPrompts.push(JSON.parse(line))
        } catch (err) {
          // TODO make the AI parse the error offer corrections
        }
      }
      assert(botPrompts.length)
      debug('loaded bot', bot, botPrompts.length)
      if (bot !== 'knowledge-matcher') {
        this.#bots.set(bot, await this.expandKnowledge(botPrompts))
      } else {
        this.#bots.set(bot, botPrompts)
      }
    }
    return this.#bots.get(bot)
  }
  async expandKnowledge(botPrompts) {
    const files = fs.readdirSync(KNOWLEDGE_DIR)
    const withKnowledge = []
    for (const item of botPrompts) {
      debug('expanding', item)
      const content = await this.#knowledge.expand(files, item.content)
      debug('content', content)
      withKnowledge.push({ ...item, content })
    }
    return withKnowledge
  }
}

export const generateFileName = () => {
  const cwd = process.cwd()
  const filename = `${cwd}/${SESSIONS_DIR}/${userName()}.md`
  return filename
}
