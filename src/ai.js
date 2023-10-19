import all from 'it-all'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import process from 'process'
import Sessions from './sessions.js'
dotenv.config()

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
  static create(filename) {
    const ai = new AI()
    ai.#disk = Sessions.create(filename)
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
    const stream = await this.#openAi.chat.completions.create({
      model: 'gpt-4',
      messages: this.#session,
      stream: true,
    })
    const results = []
    for await (const part of stream) {
      const result = part.choices[0]?.delta?.content || ''
      results.push(result)
      yield result
    }
    const result = results.join('')
    this.#session.push({ role: 'assistant', content: result })
    await this.#disk.flush(this.#session)
  }
}
