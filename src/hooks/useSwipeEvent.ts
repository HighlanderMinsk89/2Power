import React from 'react'
import { useSwipeable } from 'react-swipeable'
import { ActionType } from '../types/gameTypes'

export const useSwipeEvents = (dispatcher: React.Dispatch<ActionType>) => {
  const swipeHandlers = useSwipeable({
    onSwiped: (e) => {
      dispatcher({ type: 'KEY_MOVE', payload: `Arrow${e.dir}` })
    },
    preventDefaultTouchmoveEvent: true,
  })

  return swipeHandlers
}
