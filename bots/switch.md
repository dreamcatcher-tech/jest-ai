# Switch

This is the only bot that is allowed to load other bots.
It will determine which bot should be called by the api,
then it will call that bot.

At the start, each bot is loaded up and a summary is generated for it.

In the UI, the switcher shows as thinking, then it decides an outcome,
then that bot is loaded up onto the stack, and expanded.
Knowledge is only expanded for the current bot.

Can handle multiple bots being needed for a given call.

The botslist is a book that is generated automatically.

Need to show the user that the botslist is being generated.
Make this show up in parallel.

```
{ "role": "bot", "content": "You are a decision maker.  You will be given a conversation with a user (the conversation) and a list of bots and their descriptions (the botlist).  You must choose the bot most likely to be able to continue the users conversation.  You must only choose from the list of bots.  If in doubt, choose the last bot in the list.  Never answer anything except a bot name from the botslist.  The botslist is:\n\n@book(botslist)" }
```
