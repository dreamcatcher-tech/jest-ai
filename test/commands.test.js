/**
 * exit or anything that sounds like it, should cause the program
 * to persist its stores and exit.
 * Without the ai boost, raw command is interpreted with a double check.
 * With boost, anything loosely gets turned into a commmand,
 * where the command is the persistent edit that the user is working on.
 * Displaying a command shows in the target window with some warnings.
 * The output of the command is the next user prompt.
 *
 * AI adds some comment on it, or decides what to do next.
 */

import test from 'ava'

test.todo('exit')
