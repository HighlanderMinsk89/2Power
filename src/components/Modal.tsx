import { Button, Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { ColorMode } from '../types/gameTypes'

type Props = {
  colorMode: ColorMode
  desktop: boolean
  setNewGame: () => void
}

const modalVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
    },
  },
}

const Modal = ({ colorMode, setNewGame, desktop }: Props) => {
  return (
    <motion.div
      animate='visible'
      initial='hidden'
      variants={modalVariants}
      style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
      }}
    >
      <Flex
        bg='rgba(154, 176, 207, 0.9)'
        w={desktop ? '600px' : '300px'}
        h={desktop ? '600px' : '300px'}
        borderRadius='md'
        justifyContent='center'
        alignItems='center'
        direction='column'
      >
        <Text mb='4' fontSize='20px' fontWeight='bolder'>
          Game Over
        </Text>
        <Button
          bg={colorMode === 'dark' ? 'gray.300' : 'gray.700'}
          color={colorMode === 'light' ? 'gray.300' : 'gray.700'}
          _hover={{ bg: colorMode === 'dark' ? 'gray.500' : 'gray.900' }}
          onClick={setNewGame}
        >
          Try Again?
        </Button>
      </Flex>
    </motion.div>
  )
}

export default Modal
