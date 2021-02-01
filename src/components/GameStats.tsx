import React from 'react';

import { Flex, Stack, Text } from '@chakra-ui/react';

import PointsEarned from './PointsEarned';

type GameStateProps = {
  score: number
  highestScore: string | null
  colorMode: 'light' | 'dark'
  desktop: boolean
}

const GameStats = ({
  score,
  highestScore,
  colorMode,
  desktop,
}: GameStateProps) => {
  return (
    <Stack direction='row' pos='relative'>
      <PointsEarned />
      <Flex
        bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
        borderRadius='md'
        justifyContent='center'
        alignItems='center'
        direction='column'
        py={desktop ? '1' : '0'}
        px={desktop ? '4' : '2'}
        w='80px'
      >
        <Text fontSize='xs'>Score</Text>
        <Text fontSize='lg'>{score}</Text>
      </Flex>
      <Flex
        bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
        justifyContent='center'
        borderRadius='md'
        alignItems='center'
        direction='column'
        py={desktop ? '1' : '0'}
        px={desktop ? '4' : '2'}
        minW='80px'
      >
        <Text fontSize='xs'>Best</Text>
        <Text fontSize='lg'>{highestScore}</Text>
      </Flex>
    </Stack>
  )
}

export default GameStats
