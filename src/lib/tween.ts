import { noop } from './utils'
import { linear } from './ease'

interface TweenProps {
  from: number
  to: number
  duration: number
  onUpdate: (value: number) => void
  onComplete?: () => void
  ease?: (t: number) => number
}

export const tween = ({
  from,
  to,
  duration,
  onUpdate,
  onComplete = noop,
  ease = linear,
}: TweenProps) => {
  let isActive = true
  const startTime = performance.now()
  const durationInMillis = duration * 1000

  const handleComplete = () => {
    onUpdate(to)
    onComplete()
  }

  const next = () => {
    const elapsedTime = performance.now() - startTime

    onUpdate(ease(elapsedTime / durationInMillis) * (to - from) + from)

    return isActive
      ? elapsedTime <= durationInMillis
        ? requestAnimationFrame(next)
        : handleComplete()
      : onComplete()
  }

  next()

  return () => {
    isActive = false
  }
}
