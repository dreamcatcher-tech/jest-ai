#!/bin/sh
':' //;cd $(dirname $0);exec /usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx "$(basename $0)" "$@"

import React from 'react'
import { render } from 'ink'
import App from './src/app.js'

render(<App />, { exitOnCtrlC: true, patchConsole: true })
