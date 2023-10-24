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
    ai.#push(...ai.#disk.load())
    debug('loaded session', ai.session)
    if (ai.session.length && ai.session[0].role === 'user') {
      // TODO make it stream back responses
    }
    return ai
  }
  async prompt(content) {
    const result = await all(this.stream(content))
    return result.join('')
  }
  get session() {
    return [...this.#session]
  }
  async *stream(content) {
    this.#push({ role: 'user', content })
    yield* this.#stream()
  }
  async *#stream() {
    await this.#disk.flush(this.session)
    const results = []
    debug('session', this.session)
    const messages = await this.#disk.expand(this.session)
    debug('messages', messages)
    if (this.#injectedNextResponse) {
      yield* this.#injectedNextResponse
      results.push(...this.#injectedNextResponse)
      this.#injectedNextResponse = undefined
    } else {
      const stream = await this.#openAi.chat.completions.create({
        model: 'gpt-4',
        messages,
        stream: true,
      })
      for await (const part of stream) {
        const result = part.choices[0]?.delta?.content || ''
        results.push(result)
        yield result
      }
    }
    const result = results.join('')
    this.#push({ role: 'assistant', content: result })
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
