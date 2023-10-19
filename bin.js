#!/usr/bin/env node
import process from 'process'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import spawn from 'cross-spawn'
const args = ['--loader', 'import-jsx', __dirname + 'src/cli.js']

spawn('node', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_NO_WARNINGS: 1,
  },
  cwd: __dirname,
})

/**
 * For some unknown reason, this doesn't work when called under npx
 */
