#!/bin/sh
':' //# comment; exec /usr/bin/env node NODE_NO_WARNINGS=1 --loader=import-jsx "$0" "$@"

// import React from 'react'
// import { render } from 'ink'
// import meow from 'meow'
// import App from './src/app.js'

console.log('booting...')

// const cli = meow(
//   `
// 		Usage
// 		  $ my-ink-cli

// 		Options
// 			--name  Your name

// 		Examples
// 		  $ my-ink-cli --name=Jane
// 		  Hello, Jane
// 	`,
//   {
//     importMeta: import.meta,
//   },
// )

// render(<App />, { exitOnCtrlC: true, patchConsole: true })
