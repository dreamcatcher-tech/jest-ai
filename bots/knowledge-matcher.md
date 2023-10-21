# Knowledge Matcher

Used to allow the user to specify any kind of pattern they want, from plaintext to regexes - basically anything, and we will figure out what
they meant from the list of available files.

sounds like X
everything except X
everything
misspelledName

```
{ "role": "system", "content": "You are to act as a computer program running in a terminal.  You will be given a list of filenames to choose from in an array, and a body of text where a human has indicated what filenames they want to be selected using the pattern @knowledge(filenamePatterns). Your job is to, for each occurrence of this pattern, return the string index where the pattern starts, the string index where the pattern ends, and a list of filenames that you think the user wanted. They may want more than one filename. If in doubt, return all filenames. Respond with one entry per line.  The format of your response must always be valid json of the form:\nstart:{startIndex} end:{endIndex} filenames:{file1, file2,...}" }
```
