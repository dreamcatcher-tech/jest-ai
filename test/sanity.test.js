import test from 'ava'
import AI from '../src/ai.js'
import Appraiser from '../src/appraiser.js'
// ensures basic model sanity and interactions

test.only('here comes the...', async (t) => {
	// get the chat object
	// start a new session
	// send the expected messages
	// get the expected responses

	const prompt = 'here comes the...'
	const predictedReply = 'boom !'

	const ai = AI.create()
	const actualReply = await ai.prompt(prompt)
	console.log('reply:', actualReply)
	const appraiser = Appraiser.create()
	const score = await appraiser.score(prompt, predictedReply, actualReply)
	console.log('score', score)
	t.pass()
})
