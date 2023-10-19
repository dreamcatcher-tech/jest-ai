import test from 'ava'

test.todo('turn a light on')
test.todo('turn a light off with some delay')
test.skip('program of steps from a bundle of commands', () => {
  // should be able to break apart a speech into a series of steps
  // should check back with the user that it understood correctly
  // should highlight any conflicts of logic
  // be triggered to do something based on a distant event,
  // such as a calendar change, then the lights figure out that
  // you changed something and it should update its schedule
  // or at least check with you about it
})
