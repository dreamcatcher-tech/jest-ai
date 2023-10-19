import AI from './ai.js'

export default class Appraiser extends AI {
  static systemPrompt = `You are an appraiser of test outcomes.  You will be given 3 pieces of text: 1. the prompt that was used, 2. the predicted reply by an AI, 3. the actual reply from the AI.  Your job is to determine how close the actual reply is to the predicted reply.  You will respond with only a single number between 0 and 100`

  static create() {
    return new Appraiser()
  }
  constructor() {
    super({ system: Appraiser.systemPrompt })
  }
  async score(prompt, predictedReply, actualReply) {
    // format the metaprompt, and send in to the configured AI
    const metaPrompt = `Prompt: ${prompt}\n\nPredicted Reply: ${predictedReply}\n\nActual Reply: ${actualReply}\nScore between 0 and 100:`
    console.log('metaPrompt', metaPrompt)
    return this.prompt(metaPrompt)
  }
}
