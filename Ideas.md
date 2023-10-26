# Ideas

Ways that the workbench might be improved

Build up a system prompt based on the user asking for preferences to be changed. Show a conflict being introduced.

A history compactor, that gives relevant info as a summary, with some notes the llm took based on the conversations. It can then look up those notes if it detects this is a useful function call.

Varying degrees of assault on a given attribution score - running more loops of arguing strengthens the debate resilience, but also approaches a more thoroughly tested score, at the expense of more GPU cost.

Make a package format for an AI package which has some functionality. Says what data it needs in what format, has some tests in appraiser format, describes what its tools do, says what models it needs, says what models it was tested on and shows its testing output. Must handle packages that do not exist yet, so they can be requested.

Format for a bot, which is a system message and a set of system messages, a set of initial prompts, some embeddings, or some content to be embedded.

Use the multiple choices option to generate multiple results quicker when doing testing using the appraiser.

build in the loop that if the format fails, it sends it back to get corrected - this is the fundamental self checking. We can make some tooling that makes this convenient to do - a check function that keeps returning some results and some error messages until ready, a prompt, and the history

collapse the function list by grouping what functions they want to do, so for loading sessions, a single call, or specifically an agent that decides if they sound like they want us to do something, and then walks a tree checking for the best match, or uses embeddings to narrow down the search of large functions. This search should be the same as in the app store.

File renamer function, so can be given some types of names to follow, and looks at some of the other names, and then suggests a name for the file.

Use the git history to explain how a given issue changed over time, with being renamed and the scope changing. Summarize how it changed. Answer questions like "what happened to that issue about the swing being broken ?". Status of the issues is stored with them too. The format is stored as part of the app that deals with them. Fixing up the issues and interpreting them is done by AI. The schema can be modified in app, then all the issues upgraded, preferring a version number in their headers. Also be able to file an issue.

Captcha test that proves you are a human using intelligence. Problem is it could be thwarted by gpt4, so maybe the only way is to get a credit card payment

Git commit management whenever it wants to change the filesystem - do a pull, maybe handle the errors by dealing with the file in question, then saving the file it wants to change, generating a commit message, committing then pushing up.

Switching between bots when the context window is tight should reinflate the responses of the bot being used more than the other bots which should be compacted down.

Standard loop for running a bot command, and looping whilst errors are thrown from the postprocessing step, which could involve running code, checking schemas, anything.

Summarize the assistant reponses to keep their sizes down.

Use fine tuning to inject the knowledge book into the model, so it is always technically built on these base models. The workbench would need to test fine tuned versions by first preparing the fine tuned model based on differing data sets, and then running those in comparison with other prompt compression strategies. The system should be open to improvement from others.

Dictionary collision checker, to ensure there are no clashes in nomenclature.

Make the book responses include a link to the relevant section in a book that was used, so the user can read the book directly based on what was referenced in the response.

Show the advantages of gpt4 by doing matrix testing where we use gpt3.5 against some of the tests and show the output performance of each.
