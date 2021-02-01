import React, { Fragment, useCallback, useEffect, useState } from 'react'

import { showPointsOnMoveEvent } from '../utils/gameUtils'
import { motion } from 'framer-motion'

const variants = {
  hidden: {
    y: '-10px',
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

const PointsEarned = () => {
  const [points, setPoints] = useState<number>(0)
  const [show, setShow] = useState<boolean>(true)

  const onPointsUpdate = useCallback((points) => {
    setPoints(points)
  }, [])

  useEffect(() => {
    let timeout: number
    if (points === 0) setShow(false)
    else {
      setShow(true)

      timeout = window.setTimeout(() => {
        setShow(false)
      }, 800)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [points])

  useEffect(() => {
    showPointsOnMoveEvent.on('pointsEarned', onPointsUpdate)
  }, [onPointsUpdate])

  if (!show) return <Fragment />

  return (
    <motion.p
      variants={variants}
      animate='visible'
      initial='hidden'
      style={{ position: 'absolute', top: '-25px', left: '35px' }}
    >
      +{points}
    </motion.p>
  )
}

export default PointsEarned
