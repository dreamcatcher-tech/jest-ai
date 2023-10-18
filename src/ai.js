import all from 'it-all'
import OpenAI from 'openai'
import dotenv from 'dotenv'
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
  #system
  constructor({ system } = {}) {
    this.#system = system
    // load or write to a session file
    // load a bot based on some params and some models ?
  }
  static create() {
    return new AI()
  }
  async prompt(content) {
    const result = await all(this.stream(content))
    return result.join('')
  }
  async *stream(content, history = []) {
    let messages = [...history, { role: 'user', content }]
    if (this.#system) {
      messages.unshift({ role: 'system', content: this.#system })
    }
    messages = messages.map(({ role, content }) => ({ role, content }))
    const stream = await this.#openAi.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
    })
    const results = []
    for await (const part of stream) {
      const result = part.choices[0]?.delta?.content || ''
      results.push(result)
      yield result
    }
    return results.join('')
  }
}
