#!/usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx
import React from "react"
import { render } from "ink"
import meow from "meow"
import App from "./src/App.js"

const cli = meow(
  `
		Usage
		  $ my-ink-cli

		Options
			--name  Your name

		Examples
		  $ my-ink-cli --name=Jane
		  Hello, Jane
	`,
  {
    importMeta: import.meta,
  },
)

render(<App name={cli.flags.name} />)
