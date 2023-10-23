import AI from '../../src/ai.js'
// import Appraiser from '../src/appraiser.js'
// ensures basic model sanity and interactions

// test('here comes the...', async (t) => {
//   // get the chat object
//   // start a new session
//   // send the expected messages
//   // get the expected responses

//   const prompt = 'here comes the...'
//   const predictedReply = 'boom !'

//   const ai = AI.create()
//   const actualReply = await ai.prompt(prompt)
//   console.log('reply:', actualReply)
//   const appraiser = Appraiser.create()
//   const score = await appraiser.score(prompt, predictedReply, actualReply)
//   console.log('score', score)
//   t.pass()
// })

// detect focus and tag focus in the chat
// gpt powered listing of all gpt interfaces in the wild
// you can use our prompts to generate more prompts, but they must be royalty payments in dreamcatcher

// pitch the pubco as building the tooling for all this.

describe('appraiser', () => {
  it('knowledge-base', async () => {
    const ai = AI.create()
    await ai.setBot('book-loader')

    // load up the test prompt pairs
    // test the human ones
    // generate some extra exercising pairs
    // test those too
    // attempt to improve the bot
  })
})
