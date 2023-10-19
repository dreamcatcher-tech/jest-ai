export default function (wallaby) {
  const loader = wallaby.localProjectDir + '/node_modules/import-jsx/index.js'
  return {
    autoDetect: true,
    files: ['package.json', '.env', 'src/**/*.js', '!test/**/*.test.js'],
    tests: ['test/**/*.test.js'],
    env: {
      type: 'node',
      runner: 'node',
      params: {
        runner: `--experimental-vm-modules --loader=${loader}`,
      },
    },
    workers: { restart: true },
  }
}
