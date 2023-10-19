import all from 'it-all'
import fs from 'fs'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import process from 'process'
dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  console.log(
    'Please set OPENAI_API_KEY in your .env file.  See .env.example for an example.',
  )
  process.exit(1)
}

export default class AI {
  #openAi = new OpenAI()
  #sessionFile
  #session = []
  system(system) {
    this.#session.push({ role: 'system', content: system })
  }
  static create(filename) {
    const ai = new AI()
    ai.#sessionFile = filename
    if (filename) {
      try {
        fs.accessSync(filename)
        const data = fs.readFileSync(filename)
        const lines = data.toString().split('\n')
        for (const line of lines) {
          if (!line) {
            continue
          }
          try {
            const session = JSON.parse(line)
            ai.#session.push(session)
          } catch (err) {
            // TODO make the AI parse the error offer corrections
          }
        }
      } catch (err) {
        // TODO log the error somewhere for the user to receive comment on
      }
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
    this.#session.push({ role: 'user', content })
    await this.#flush()
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
    await this.#flush()
  }
  #flushedIndex = 0
  async #flush() {
    if (!this.#sessionFile) {
      return
    }
    const lines = []
    for (let i = this.#flushedIndex; i < this.#session.length; i++) {
      const item = this.#session[i]
      lines.push(JSON.stringify(item))
    }
    fs.appendFileSync(this.#sessionFile, lines.join('\n') + '\n')
    this.#flushedIndex = this.#session.length
  }
}
