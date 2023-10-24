# jest-ai

AI Agent testing suites

The goal of this repository is to produce bots that are listed in the `bots/` folder. These bots form a botnet where they can call each other, and coordinate together to give the user the best possible answer. Primarily we are making an AI assistant to help advise on matters of the Dreamcatcher, but the general framework is applicable to everything.

These bots should be able to call functions and perform tasks that alter external system state. These bots will be used to write and maintain this repository, as a ranging shot for the coming age of `anything apps`

The first bot to load is always the `colonel`. This bot controls all the other bots, and is intentionally difficult to modify as doing so would render the application unusable.

We must get to a position where we can deploy the testing framework, and specify jobs in terms of the prompt responses we want, and have humans work towards fixing those to work as we expect.

## Live update of a test story

Running in some trusted environment.

There is some gatekeeper that polices changes going thru, then there is some way that passed changes get fed back to clients.

The guardian needs some kind of way to refer to its core, and run the tests specified there, then pass it.

The guardian should be able to run tests on its core and update them.

## Tasks

1. Make a mock gui of what you want to see - this would be just a jest looking
   feedback screen of the tests running
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
2. ~~access to system prompts~~
3. ~~dump sessions to disk with restore~~
4. ~~knowledge base filtered inclusion~~
5. web url parsing into the knowledge base
6. ~~specify a bot by a combination of system, session, and knowledge base~~
7. consistent edit
8. multibot nested execution
9. ~~bot loading~~
10. edit the knowledge base using the stateboard window
11. self improvement of a bot based on some desired prompt outcomes
12. swap out a bot based on human interaction using the colonel
13. storage of preferences and issues
14. window crunching tactics - embeddings or merkle tree
15. load the whole book and only use relevant parts so no rate limits are hit
16. show what book parts got loaded with each symbol detection
17. router to pick the bot to load
18. make a log file that shows what messages are being sent to openai
19. Example attribution bot for contributions to enhancing a bot thru usage

Should be able to set up test scrips and load them with good prompts.

Colonel needs to handle multiple bot jobs per prompt

colonel could just use another bot, a system bot, to answer system commands.

Be able to discuss the current status of combinations of bots.

The appraiser should give some reasoning back, which can serve as feedback to the AI to try again with some modified responses. When a human sees an AI stuck in a loop, it should be able to free it with very little effort.

Bot mode and workbench mode - change the prompt, break out with a hotkey. Lets you change the system message part way thru a chat and have it reload the whole chat again. This lets sessions be generated and prompts manually altered, or chat focus altered to be different

Bot should be able to switch to another bot, and be preloaded with convo so far

How should we handle peoples data ? Detect successful chains so we can get there quicker next time. In the background we should be processing for success scores.

Extract a common format from each one, and walk the db

## Issues

1. if a chat is loaded with an assistant, then the response is not automatically sent to gpt until the next user input
2. editing the session files is problematic. being able to dump the entire contents of our md files in as part of a bot primer is difficult to do in jsonl.
3. changing md files should cause the bot to reload
4. restarting the chat from a point after changing the prompt loading is hard
5. appraiser should consider the headings of the agents too
6. be able to expand out the knowledge base prompts
7. nesting bots should work, where a bot can be composed of other bots, and shown in the gui
8. if loading a session, do not overwrite it, become ephemeral
9. preference bot should know when a rule is short or forever, and should be overridable
10. debug view of how the bots decided on the routing

Start making a blockchain app that uses the colonel app to generate a hard coded application that represents everything the colonel has been asked to do, like macros, to date

## Milestones

1. app on constantly without restarts - no need to ever leave it
2. put up in a web version with added edit and button abilities
3. connect to solidity contract so can take in money for packets
