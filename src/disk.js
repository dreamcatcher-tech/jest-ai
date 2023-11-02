import userName from 'git-user-name'
import process from 'process'
import path from 'path'
import fs from 'fs'
import { expect } from 'chai'
import Debug from 'debug'
import BookLoader from './tools/book-loader.js'
import assert from 'assert-fast'
const debug = Debug('disk')
const SESSIONS_DIR = 'sessions'
const BOTS_DIR = 'bots'
const KNOWLEDGE_DIR = 'book'

export default class Disk {
  #bots = new Map()
  #session // the filename of the session to write to
  #log // filename of the log to keep
  #flushedIndex = 0
  #book = BookLoader.create()
  static create(session) {
    session && expect(session).to.be.a('string')
    const sessions = new Disk(session)
    if (session) {
      const dir = path.dirname(session)
      sessions.#session = session
      const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-')
      sessions.#log = `${dir}/log-${timestamp}.md`
    }
    return sessions
  }
  async expand(session) {
    expect(session).to.be.an('array')
    const messages = []
    const functions = []
    for (const item of session) {
      if (item.role === 'bot') {
        const botName = item.content
        const bot = await this.loadBot(botName)
        debug('bot for', botName, bot)
        messages.push(...bot.messages)
        functions.push(...bot.functions)
      } else {
        messages.push(item)
      }
    }
    return { messages, functions }
  }
  load() {
    if (this.#session) {
      try {
        fs.accessSync(this.#session)
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
        // TODO check that expanding the session works correctly
        return { session }
      } catch (err) {
        // TODO log the error somewhere for the user to receive comment on
        if (err.code !== 'ENOENT') {
          console.error(err)
        }
      }
    }
    return { session: [] }
  }
  async flush(session) {
    expect(session).is.an('array')
    if (!this.#log) {
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
    await fs.promises.appendFile(this.#log, lines.join('\n') + '\n')
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
      const messages = []
      let functionsString
      for (const line of lines) {
        if (!line) {
          continue
        }

        if (line.trim() === '## FUNCTIONS') {
          expect(functionsString).to.be.undefined
          functionsString = ' '
        } else if (functionsString) {
          if (!line.trim().startsWith('```')) {
            functionsString += line
          }
        } else {
          try {
            messages.push(JSON.parse(line))
          } catch (err) {
            // TODO make the AI parse the error offer corrections
          }
        }
      }
      expect(messages).length.to.be.above(0)

      const functions = []
      try {
        if (functionsString) {
          const functionsArray = JSON.parse(functionsString)
          for (const fn of functionsArray) {
            assert(fn.title, `missing title for ${JSON.stringify(fn, null, 2)}`)
            assert(fn.description, `missing description for ${fn.title}`)
            const name = fn.title.replace(' ', '_')
            const { description, ...parameters } = fn
            debug('adding function', name)
            functions.push({ name, description, parameters })
          }
        }
      } catch (error) {
        console.error('failed to parse functions: ' + functionsString)
      }

      debug('loaded bot', bot, messages.length, functions.length)
      if (bot === 'book-loader') {
        debug('knowledge matcher loaded without using knowledge matcher')
        this.#bots.set(bot, { messages, functions })
      } else {
        const withKnowledge = await this.expandKnowledge(messages)
        this.#bots.set(bot, { messages: withKnowledge, functions })
      }
      // need to reloop and insert all the other bots it loads
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
