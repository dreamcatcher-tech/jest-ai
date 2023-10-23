import { expect } from 'chai'
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
    await this.#ensureAi() // avoid infinite loop
    expect(files).to.be.an('array')
    expect(files).to.have.length.above(0)
    expect(content).to.be.a('string')
    expect(content).to.be.ok

    const filenames = files.map(({ name }) => name)
    const prompt = `[${filenames.join(',')}]\n\n${content}`
    debug('prompt', prompt)
    if (!this.#cache.has(prompt)) {
      let parseError
      let loop = 0
      do {
        let response = await this.#ai.prompt(prompt)
        debug('response', response)
        try {
          loop++
          const replacements = JSON.parse(response)
          assert(Array.isArray(replacements), 'item must be an array')
          const nextContent = replace(replacements, content, files)
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

const replace = (replacements, content, files) => {
  expect(replacements).to.be.an('array')
  expect(content).to.be.a('string')
  expect(content).to.be.ok
  expect(files).to.be.an('array')
  expect(files).to.have.length.above(0)

  for (const replacement of replacements) {
    const { pattern, filenames } = replacement
    expect(pattern).to.be.a('string')
    expect(filenames).to.be.an('array')
    expect(filenames).to.have.length.above(0)

    let replacementContent = ''
    for (const filename of filenames) {
      const file = files.find((file) => file.name === filename)
      expect(file).to.be.ok
      replacementContent += file.content + '\n\n'
    }
    const start = content.indexOf(pattern)
    expect(start).to.be.above(-1)
    const end = start + pattern.length

    const before = content.slice(0, start)
    const after = content.slice(end)
    content = before + replacementContent + after
  }
  return content
}
