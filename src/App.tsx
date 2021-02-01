import * as React from 'react';

import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';
import GameComponent from './components/GameComponent';

const theme = extendTheme({
  sizes: {
    text: {
      mobile: '12px',
      desktop: '16px',
    },
  },
  styles: {
    global: (props) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'dark' ? '#555b6e' : '#faf9f9',
      },
    }),
  },
})

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex justify='flex-end' mt='2' mr='2' minW='300px'>
      <ColorModeSwitcher />
    </Flex>
    <Flex justify='center' fontSize='xl'>
      <GameComponent />
    </Flex>
  </ChakraProvider>
)
