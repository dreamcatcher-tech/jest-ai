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
import History from './history.js'
// import TextInput from 'ink-text-input'
import { TextInput } from '@inkjs/ui'
import { useAsync } from 'react-async-hook'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
dotenv.config()

const openai = new OpenAI()
// import Image from 'ink-image'
// import dreamcatcher from '../assets/dreamcatcher.png'

const spinner = cliSpinners.clock

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

export default function App() {
	const [prompt, setPrompt] = useState('')
	const [history, setHistory] = useState([])
	useInput((input, key) => {
		// console.log('input', input, 'key', key)
	})
	const onSubmit = useCallback(
		async (...args) => {
			// generate an id, then store a text item showing history of chat
			const stream = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
				stream: true,
			})
			for await (const part of stream) {
				process.stdout.write(part.choices[0]?.delta?.content || '')
			}
		},
		[prompt],
	)
	return (
		<Box flexDirection="column">
			<Static items={[{}]}>
				{(image, index) => (
					<Box key={index}>
						<Gradient name="rainbow">
							<BigText font="chrome" text="dreamcatcher.ai" />
						</Gradient>
					</Box>
				)}
			</Static>
			<History history={history} />
			<Box marginRight={1} borderStyle="round">
				<Text>💡 </Text>
				<TextInput
					value={prompt}
					onChange={setPrompt}
					onSubmit={onSubmit}
					placeholder=" (messy genius goes here)"
				/>
			</Box>
		</Box>
	)
}
