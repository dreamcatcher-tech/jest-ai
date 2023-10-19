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

## Task priority

1. ~~history in the prompt~~
2. access to system prompts
3. ~~dump sessions to disk with restore~~
4. knowledge base filtered inclusion
5. web url parsing into the knowledge base
6. specify a bot by a combination of system, session, and knowledge base
7. consistent edit
8. multibot nested execution

Be able to discuss the current status of combinations of bots.

The appraiser should give some reasoning back, which can serve as feedback to the AI to try again with some modified responses. When a human sees an AI stuck in a loop, it should be able to free it with very little effort.

Bot mode and workbench mode - change the prompt, break out with a hotkey. Lets you change the system message part way thru a chat and have it reload the whole chat again. This lets sessions be generated and prompts manually altered, or chat focus altered to be different

Bot should be able to switch to another bot, and be preloaded with convo so far

How should we handle peoples data ? Detect successful chains so we can get there quicker next time. In the background we should be processing for success scores.

## Issues

1. if a chat is loaded with an assistant, then the response is not automatically sent to gpt until the next user input
2. editing the session files is problematic. being able to dump the entire contents of our md files in as part of a bot primer is difficult to do in jsonl.
3. changing md files should cause the bot to reload
4. restarting the chat from a point after changing the prompt loading is hard
5. appraiser should consider the headings of the agents too
