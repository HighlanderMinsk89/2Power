import { useEffect, useState } from 'react';

export const useLocalStorage = () => {
  const [highestScore, setHighestScore] = useState<string | null>(
    localStorage.getItem('highestScore')
  )

  useEffect(() => {
    if (highestScore === null) {
      setHighestScore('0')
      localStorage.setItem('highestScore', '0')
    }
  }, [highestScore])

  const updateHighestScore = (score: string) => {
    setHighestScore(score)
    localStorage.setItem('highestScore', score)
  }

  return [highestScore, updateHighestScore] as const
}
