#!/usr/bin/env node

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import spawn from 'cross-spawn'
const args = ['--experimental-loader=import-jsx', __dirname + 'cli.js']

spawn('node', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    IMPORT_JSX_CACHE: 0,
    NODE_OPTIONS: '--experimental-loader=import-jsx',
    NODE_NO_WARNINGS: 1,
  },
})
