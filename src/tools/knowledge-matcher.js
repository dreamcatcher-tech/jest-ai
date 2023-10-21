import assert from 'assert-fast'
import AI from '../ai.js'
import Debug from 'debug'
const debug = Debug('knowledge')
// load up the bot instructions which are tested separately

export default class KnowledgeMatcher {
  #ai
  #cache = new Map()
  static create() {
    return new KnowledgeMatcher()
  }
  async expand(files, content) {
    await this.#ensureAi()
    assert(Array.isArray(files))
    assert(typeof content === 'string')
    assert(content)
    const prompt = `${files.join(',')}\n\n${content}`
    debug('prompt', prompt)
    return content
    if (!this.#cache.has(prompt)) {
      let parseError
      let loop = 0
      do {
        let response = await this.#ai.prompt(prompt)
        try {
          loop++
          const parsed = JSON.parse(response)
          const nextContent = replace(parsed, content)
          this.#cache.set(prompt, nextContent)
          return nextContent
        } catch (err) {
          debug('parse error', err)
          parseError = err
          response = await this.#ai.prompt(
            `please correct your output as it gives the following error\n\n${err.message}`,
          )
        }
      } while (parseError && loop < 10)
    }
    return this.#cache.get(prompt)
  }
  async #ensureAi() {
    if (this.#ai) {
      return
    }
    this.#ai = AI.create()
    await this.#ai.setBot('knowledge-matcher')
  }
}
