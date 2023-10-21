import all from 'it-all'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import process from 'process'
import Sessions from './disk.js'
import assert from 'assert-fast'
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
    ai.#disk = Sessions.create(session)
    ai.#session = ai.#disk.load()
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
    this.#session.push({ role: 'user', content })
    await this.#disk.flush(this.#session)
    const results = []
    const messages = await this.#disk.expand(this.#session)
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
    this.#session.push({ role: 'assistant', content: result })
    await this.#disk.flush(this.#session)
  }
  #injectedNextResponse
  '@inject'(...content) {
    this.#injectedNextResponse = content
  }
  async setBot(bot) {
    assert(typeof bot === 'string')
    assert(!bot.startsWith('.'), 'bot should not start with .')
    assert(!bot.startsWith('/'), 'bot should not start with /')
    assert(!bot.endsWith('.md'), 'bot should not end with .md')
    await this.#disk.loadBot(bot) // does the check of the bot
    this.#session.push({ role: 'bot', content: bot })
  }
}
