import all from 'it-all'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import process from 'process'
import Disk from './disk.js'
import { expect } from 'chai'
import Debug from 'debug'
dotenv.config()
const debug = Debug('ai')

if (!process.env.OPENAI_API_KEY) {
  console.log(
    'Please set OPENAI_API_KEY in your .env file.  See .env.example for an example.',
  )
  process.exit(1)
}

export default class AI {
  #openAi = new OpenAI()
  #disk
  #session = []
  static create({ session } = {}) {
    const ai = new AI()
    ai.#disk = Disk.create(session)
    const loaded = ai.#disk.load()
    expect(loaded).has.property('session')
    ai.#push(...loaded.session)
    debug('loaded session', ai.session)
    return ai
  }
  async prompt(content) {
    const result = await all(this.stream(content))
    return result.join('')
  }
  get session() {
    return [...this.#session]
  }
  popUnsubmitted() {
    const unsubmitted = this.session.pop()
    if (unsubmitted?.role === 'user') {
      this.#session.pop()
      return unsubmitted
    }
  }
  async *stream(content) {
    this.#push({ role: 'user', content })
    yield* this.#stream()
  }
  async *#stream() {
    await this.#disk.flush(this.session)
    const contentParts = []
    const functionParts = []
    debug('session', this.session)
    const { messages, functions } = await this.#disk.expand(this.session)
    debug('messages', messages)
    debug('functions', functions)
    if (this.#injectedNextResponse) {
      yield* this.#injectedNextResponse
      contentParts.push(...this.#injectedNextResponse)
      this.#injectedNextResponse = undefined
    } else {
      const params = {
        model: 'gpt-4',
        messages,
        stream: true,
      }
      functions.length && (params.functions = functions)
      const stream = await this.#openAi.chat.completions.create(params)
      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content || ''
        content && contentParts.push(content)
        const fn = part.choices[0]?.delta?.function_call || ''
        fn && functionParts.push(fn)
        if (content) {
          yield content
        }
        if (fn) {
          if (fn.name) {
            yield 'FUNCTION: ' + fn.name + '\n'
          }
          if (fn.arguments) {
            yield fn.arguments
          }
        }
      }
    }
    if (functionParts.length) {
      let args = ''
      let name = ''
      functionParts.forEach((part) => {
        if (part.arguments) {
          args += part.arguments
        } else if (part.name) {
          name = part.name
        } else {
          throw Error('unknown function part' + JSON.stringify(part, null, 2))
        }
      })
      const string = 'FUNCTION: ' + name + '\n' + args
      this.#push({ role: 'assistant', content: string })
    }
    if (contentParts.length) {
      this.#push({ role: 'assistant', content: contentParts.join('') })
    }
    if (functionParts.length && contentParts.length) {
      throw new Error('both function and content parts received')
    }
    await this.#disk.flush(this.session)
  }
  #injectedNextResponse
  '@inject'(...content) {
    this.#injectedNextResponse = content
  }
  async setBot(bot) {
    expect(bot).to.be.a('string')
    expect(bot).to.be.ok
    expect(bot.startsWith('.')).to.be.false
    expect(bot.startsWith('/')).to.be.false
    expect(bot.endsWith('.md')).to.be.false

    await this.#disk.loadBot(bot) // does the check of the bot
    this.#push({ role: 'bot', content: bot })
  }
  #push(...items) {
    for (const item of items) {
      expect(item).to.be.an('object')
      expect(item).to.have.property('role')
      expect(item).to.have.property('content')
      expect(item.role).to.be.a('string')
      expect(item.content).to.be.a('string')
      expect(item.role).to.be.oneOf(['user', 'assistant', 'system', 'bot'])
      this.#session.push(item)
    }
  }
}
