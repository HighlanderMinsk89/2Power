import React, { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { Flex } from '@chakra-ui/react'

import { ColorMode, GameBoard } from '../types/gameTypes'
import { bounceBoardOnMove } from '../utils/gameUtils'
import Modal from './Modal'
import RowComponent from './RowComponent'

type BoardProps = {
  board: GameBoard
  playing: boolean
  desktop: boolean
  colorMode: ColorMode
  setNewGame: () => void
}

const boardBounceVariants = {
  ArrowLeft: {
    x: [0, -10, 0],
  },
  ArrowRight: {
    x: [0, 10, 0],
  },
  ArrowUp: {
    y: [0, -10, 0],
  },
  ArrowDown: {
    y: [0, 10, 0],
  },
}

const BoardWrapper = ({
  board,
  playing,
  desktop,
  colorMode,
  setNewGame,
}: BoardProps) => {
  const [boardBounceDir, setBoardBounceDir] = useState<string>('')

  useEffect(() => {
    let interval: number
    bounceBoardOnMove.on('bounceBoard', (direction) => {
      setBoardBounceDir(direction)
      interval = window.setTimeout(() => {
        setBoardBounceDir('')
      }, 100)
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      animate={boardBounceDir}
      variants={boardBounceVariants}
      transition={{ duration: 0.2 }}
    >
      <Flex direction='column' w='100%' m='2' pos='relative'>
        {board &&
          board.map((row, idx) => {
            return (
              <RowComponent
                key={idx}
                row={row}
                desktop={desktop}
                colorMode={colorMode}
              />
            )
          })}
        {!playing && (
          <Modal
            colorMode={colorMode}
            setNewGame={setNewGame}
            desktop={desktop}
          />
        )}
      </Flex>
    </motion.div>
  )
}

export default BoardWrapper
