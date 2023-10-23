import userName from 'git-user-name'
import process from 'process'
import fs from 'fs'
import { expect } from 'chai'
import Debug from 'debug'
import BookLoader from './tools/book-loader.js'
const debug = Debug('disk')
const SESSIONS_DIR = 'sessions'
const BOTS_DIR = 'bots'
const KNOWLEDGE_DIR = 'book'

export default class Disk {
  #bots = new Map()
  #filename // the filename of the session to write to
  #flushedIndex = 0
  #book = BookLoader.create()
  static create(session) {
    session && expect(session).to.be.a('string')
    const sessions = new Disk(session)
    sessions.#filename = session
    return sessions
  }
  async expand(session) {
    expect(session).to.be.an('array')
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
      // this.#flushedIndex = session.length
      this.#filename = undefined
      // TODO check that expanding the session works correctly
      return session
    } catch (err) {
      // TODO log the error somewhere for the user to receive comment on
      console.error(err)
      return []
    }
  }
  async flush(session) {
    expect(session).is.an('array')
    if (!this.#filename) {
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
    await fs.promises.appendFile(this.#filename, lines.join('\n') + '\n')
    this.#flushedIndex = session.length
  }
  async loadBot(bot) {
    if (!this.#bots.has(bot)) {
      expect(bot).to.be.a('string')
      expect(bot.startsWith('.')).to.be.false
      expect(bot.startsWith('/')).to.be.false
      expect(bot.endsWith('.md')).to.be.false

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
      expect(botPrompts).length.to.be.above(0)
      debug('loaded bot', bot, botPrompts.length)
      if (bot === 'book-loader') {
        debug('knowledge matcher loaded without using knowledge matcher')
        this.#bots.set(bot, botPrompts)
      } else {
        const withKnowledge = await this.expandKnowledge(botPrompts)
        this.#bots.set(bot, withKnowledge)
      }
    }
    return this.#bots.get(bot)
  }
  async expandKnowledge(botPrompts) {
    const files = fs.readdirSync(KNOWLEDGE_DIR).map((name) => {
      const content = fs.readFileSync(`${KNOWLEDGE_DIR}/${name}`).toString()
      return { name, content }
    })
    const withKnowledge = []
    for (const item of botPrompts) {
      debug('expanding knowledge', item)
      const content = await this.#book.expand(files, item.content)
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
