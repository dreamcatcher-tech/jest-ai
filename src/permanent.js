import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import { Box, Static } from 'ink'
import { Item } from './history.js'
import PropTypes from 'prop-types'

export default function Permanent({ history = [] }) {
  return (
    <Static items={[{}, ...history]}>
      {(item, index) => {
        if (index === 0) {
          return (
            <Box key={index}>
              <Gradient name="rainbow">
                <BigText font="chrome" text="dreamcatcher.ai" />
              </Gradient>
            </Box>
          )
        }
        return <Item {...item} key={index} />
      }}
    </Static>
  )
}
Permanent.propTypes = { history: PropTypes.arrayOf(PropTypes.object) }
