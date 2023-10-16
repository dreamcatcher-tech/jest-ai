# jest-ai

AI Agent testing suites

## Live update of a test story

Running in some trusted environment.

There is some gatekeeper that polices changes going thru, then there is some way that passed changes get fed back to clients.

The guardian needs some kind of way to refer to its core, and run the tests specified there, then pass it.

The guardian should be able to run tests on its core and update them.

## Tasks

1. Make a mock gui of what you want to see - this would be just a jest looking
   feedback screen of the tests runing
2. See how to use the test to allow some changes to be made to some filesystem

## Interface

You: I want to start a new session

GPT: This is a new session, stored under folder xyz. Do you want to use any templates ?
here are some suggestions

You: make the system message be "I am a cat". How are the system tests doing with that ?

GPT: ok. The tests for core have failed completely. meow. (shows the test ui viewer)

You: (use the safeword to break out of the model)

## Ask for test mdoel that isn't there

You: show me the tests for model xyz
GPT: (switches nav to model list UI) I'm not sure which one you mean, is it <link> this one ?

## check on fine tuning

You: yo hows the fine tuning going
GPT: (shows the fine tuning status UI) there's 3 jobs going right now, 2 in the queue, and one failed
