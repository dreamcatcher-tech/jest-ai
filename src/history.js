import React, { useEffect, useState, useCallback } from 'react'
import {
	render,
	useInput,
	useStdin,
	useApp,
	Box,
	Text,
	Static,
	useStdout,
	Newline,
} from 'ink'
import { TaskList, Task } from 'ink-task-list'
import cliSpinners from 'cli-spinners'
import Spinner from 'ink-spinner'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import ti from 'terminal-image'
// import TextInput from 'ink-text-input'
import { TextInput } from '@inkjs/ui'
import { useAsync } from 'react-async-hook'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'

const GPT = ({ contents }) => {
	return (
		<Box>
			<Text color="green">🦾: </Text>
			<Text>{contents}</Text>
		</Box>
	)
}
const Solver = ({ contents }) => {
	return (
		<Box>
			<Text color="magenta">💡: </Text>
			<Text>{contents}</Text>
		</Box>
	)
}

export default function History({ history }) {
	// check all the formats
	// return the list of components with contents as provided
	// switch between different agent boxes and flags
}
