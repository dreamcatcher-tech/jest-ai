#!/usr/bin/env node

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

import spawn from 'cross-spawn'
spawn('node', ['--loader=import-jsx', __dirname + '/cli.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_NO_WARNINGS: 1,
  },
})
