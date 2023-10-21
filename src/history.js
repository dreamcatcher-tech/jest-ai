import { Box, Text } from 'ink'
import assert from 'assert-fast'
import PropTypes from 'prop-types'

// put in a topic badge so we can show what the AI is goaled to
const GPT = ({ contents }) => <Chat contents={contents} icon="🦾" />
GPT.propTypes = { contents: PropTypes.string.isRequired }
const Solver = ({ contents }) => <Chat contents={contents} icon="💡" />
Solver.propTypes = { contents: PropTypes.string.isRequired }
const System = ({ contents }) => <Chat contents={contents} icon="🔧" />
System.propTypes = { contents: PropTypes.string.isRequired }
const Function = ({ contents }) => <Chat contents={contents} icon="🧰" />
Function.propTypes = { contents: PropTypes.string.isRequired }
const Bot = ({ contents }) => <Chat contents={contents} icon="🤖" />
Bot.propTypes = { contents: PropTypes.string.isRequired }

const Chat = ({ contents, icon }) => (
  <Box flexDirection="row" columnGap={1}>
    <Text width={2} minWidth={2}>
      {icon}
    </Text>
    <Box paddingRight={3}>
      <Text>{contents}</Text>
    </Box>
  </Box>
)
Chat.propTypes = {
  contents: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default function History({ history = [] }) {
  assert(Array.isArray(history))
  return (
    <Box flexDirection="column">
      {history.map((item, index) => (
        <Item {...item} key={index} />
      ))}
    </Box>
  )
}
History.propTypes = { history: PropTypes.arrayOf(PropTypes.object) }

export const Item = ({ role, content }) => {
  switch (role) {
    case 'assistant':
      return <GPT contents={content} />
    case 'system':
      return <System contents={content} />
    case 'user':
      return <Solver contents={content} />
    case 'function':
      return <Function contents={content} />
    case 'bot':
      return <Bot contents={content} />
    default:
      throw new Error(`unknown role ${role}`)
  }
}
Item.propTypes = {
  role: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}
