import React from 'react'
import { Cell, ColorMode } from '../types/gameTypes'
import { Flex, Heading } from '@chakra-ui/react'
import { cellColorDecider } from '../utils/gameUtils'
import { motion } from 'framer-motion'

type CellProps = {
  key: number
  cell: Cell
  desktop: boolean
  colorMode: ColorMode
}

const cellAnimationVariant = {
  bounce: {
    scale: [1, 1.14, 1],
    transition: {
      duration: 0.3,
    },
  },
}

const CellComponent = ({ cell, desktop, colorMode }: CellProps) => {
  return (
    <motion.div
      animate={cell.bounce ? 'bounce' : ''}
      variants={cellAnimationVariant}
    >
      <Flex
        justify='center'
        align='center'
        w={desktop ? '109px' : '55px'}
        h={desktop ? '109px' : '55px'}
        m={desktop ? '1' : '1px'}
        bg={cellColorDecider(cell.value, colorMode)}
        borderRadius={desktop ? 'lg' : 'md'}
      >
        <Heading as='h1' size={desktop ? 'xl' : 'md'}>
          {cell.value || ''}
        </Heading>
      </Flex>
    </motion.div>
  )
}

export default CellComponent
