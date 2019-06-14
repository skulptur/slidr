interface TouchScrollBlockerProps {
  element: HTMLElement
  preventVertical?: boolean
  preventHorizontal?: boolean
  threshold?: number
}

export function createTouchScrollBlocker({ element, ...props }: TouchScrollBlockerProps) {
  let startX: number = 0
  let startY: number = 0
  let _threshold: number = 10
  let _preventVertical: boolean = false
  let _preventHorizontal: boolean = false

  set(props)

  element.addEventListener('touchstart', handleStart)
  element.addEventListener('touchmove', handleMove)

  function handleStart(e: TouchEvent) {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }

  function handleMove(e: TouchEvent) {
    const isHorizontalMove = Math.abs(e.touches[0].clientX - startX) > _threshold
    const isVerticalMove = Math.abs(e.touches[0].clientY - startY) > _threshold

    isHorizontalMove && _preventVertical && e.preventDefault()
    isVerticalMove && _preventHorizontal && e.preventDefault()
  }

  function set({
    preventVertical = _preventVertical,
    preventHorizontal = _preventHorizontal,
    threshold = _threshold,
  }: Omit<TouchScrollBlockerProps, 'element'>) {
    _preventVertical = preventVertical
    _preventHorizontal = preventHorizontal
    _threshold = threshold
  }

  function dispose() {
    element.addEventListener('touchstart', handleStart)
    element.addEventListener('touchmove', handleMove)
  }

  return {
    set,
    dispose,
  }
}
