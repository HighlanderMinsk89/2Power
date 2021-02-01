import React from 'react';

import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex
} from '@chakra-ui/react';

import { ColorMode } from '../types/gameTypes';

type RulesProps = {
  colorMode: ColorMode
  desktop: boolean
}

const Rules = ({ colorMode, desktop }: RulesProps): JSX.Element => {
  return (
    <Flex direction='column' mt='2' alignSelf='flex-start'>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton
            _expanded={
              colorMode === 'light'
                ? { bg: 'gray.300', color: 'black' }
                : { bg: 'gray.700', color: 'white' }
            }
          >
            <Box flex='1' textAlign='left'>
              Rules
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel fontSize={desktop ? 'md' : 'sm'}>
            Use your arrow keys or swipe to move the tiles to desired direction.
            When the tiles with the same value touch they will be merged and
            value doubled. Game ends when there is no possible move. Can you
            reach 2048 tile?
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}

export default Rules
