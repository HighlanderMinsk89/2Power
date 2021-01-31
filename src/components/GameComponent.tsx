import { Flex, Heading, useColorMode, useMediaQuery } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React, { useEffect, useReducer } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSwipeEvents } from '../hooks/useSwipeEvent'
import { GameState } from '../types/gameTypes'
import { getInitialBoard, handleMoveAndAdd } from '../utils/gameUtils'
import BoardWrapper from './BoardWrapper'
import GameStats from './GameStats'
import Rules from './Rules'

type ActionType = {
  type: string
  payload?: any
}

const initialState: GameState = {
  board: getInitialBoard(),
  playing: true,
  score: 0,
}

const gameReducer = (
  state: typeof initialState,
  action: ActionType
): typeof state => {
  switch (action.type) {
    case 'KEY_MOVE':
      const newState = handleMoveAndAdd(action.payload, state)
      return newState
    case 'SET_NEW_GAME':
      return initialState
    default:
      return state
  }
}

const GameComponent = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { board } = state
  const [highestScore, updateHighestScore] = useLocalStorage()
  const [desktop] = useMediaQuery('(min-width: 650px)')
  const { colorMode } = useColorMode()
  const swipeHandlers = useSwipeEvents(dispatch)

  useEffect(() => {
    if (highestScore && state.score > +highestScore) {
      updateHighestScore(state.score + '')
    }
  }, [state.score, highestScore, updateHighestScore])

  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) =>
      dispatch({ type: 'KEY_MOVE', payload: e.key })
    )
  }, [])

  const setNewGame = () => dispatch({ type: 'SET_NEW_GAME' })

  return (
    <Flex
      justify='center'
      align='center'
      direction='column'
      w={desktop ? '600px' : '300px'}
    >
      <Flex
        justify='space-between'
        w='100%'
        alignItems='center'
        mb='2'
        mt='1'
        zIndex={3}
      >
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Heading
            as={desktop ? 'h1' : 'h4'}
            ml='2'
            bgGradient={
              colorMode === 'light'
                ? 'linear(to-t, gray.500, gray.900)'
                : 'linear(to-t, gray.100, gray.500)'
            }
            bgClip='text'
          >
            2Power
          </Heading>
        </motion.div>
        <motion.div
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
          }}
        >
          <GameStats
            score={state.score}
            highestScore={highestScore}
            colorMode={colorMode}
            desktop={desktop}
          />
        </motion.div>
      </Flex>
      <motion.div
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        // initial={{ scale: 0 }}
        // animate={{ scale: [0.2, 0.4, 0.6, 0.8, 1] }}
        transition={{
          delay: 1.1,
          duration: 0.8,
        }}
      >
        <Flex
          w='100%'
          bg={colorMode === 'light' ? 'gray.300' : 'gray.300'}
          borderRadius='lg'
          {...swipeHandlers}
        >
          {board && (
            <BoardWrapper
              board={board}
              playing={state.playing}
              colorMode={colorMode}
              desktop={desktop}
              setNewGame={setNewGame}
            />
          )}
        </Flex>
      </motion.div>
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        style={{ alignSelf: 'flex-start' }}
      >
        <Rules colorMode={colorMode} desktop={desktop} />
      </motion.div>
    </Flex>
  )
}

export default GameComponent
