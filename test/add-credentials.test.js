import test from 'ava'

test.only('ask for openai key if not present', async (t) => {
  // start a chat
  // notice there is no openAI api key
  // ask for the key
  // write to env if not present

  // check key
  // if check is ok, call out to openai to say what you did

  // ask to change the api key to something different

  // without this, it would just be a browser of files ?
  // so can make a chain that mimicks the filesystem pieces and can do commands on it ?
  // the ai can then use the chain commands to know what it is allowed to do ?
  //   const prompt = 'here comes the...'
  //   const predictedReply = 'boom !'

  //   const ai = AI.create()
  //   const actualReply = await ai.prompt(prompt)
  //   console.log('reply:', actualReply)
  //   const appraiser = Appraiser.create()
  //   const score = await appraiser.score(prompt, predictedReply, actualReply)
  //   console.log('score', score)
  t.pass()
})
test.skip('change the api key', async (t) => {
  // this will involve invoking the terminal prompter function, which is cancellable
  // then when the new key is set, passing some comment about it
})
test.todo('use an existing openai key if present')
