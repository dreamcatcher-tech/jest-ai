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
