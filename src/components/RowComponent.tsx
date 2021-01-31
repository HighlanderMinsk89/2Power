import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Cell, ColorMode } from '../types/gameTypes'
import CellComponent from './CellComponent'

type RowProps = {
  row: Cell[]
  key: number
  desktop: boolean
  colorMode: ColorMode
}

const RowComponent = ({ row, desktop, colorMode }: RowProps) => {
  return (
    <Flex justify='flex-start'>
      {row.map((cell, idx) => {
        return (
          <CellComponent
            key={idx}
            cell={cell}
            desktop={desktop}
            colorMode={colorMode}
          />
        )
      })}
    </Flex>
  )
}

export default RowComponent
