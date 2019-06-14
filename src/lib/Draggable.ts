import { noop, isMouseEvent } from './utils'

interface DraggableLens {
  get: () => number
  set: (value: number) => void
}

interface DraggableProps {
  element: HTMLElement
  onDragStart?: (x: number, y: number) => void
  onDrag?: (x: number, y: number) => void
  onDragEnd?: (x: number, y: number) => void
  xLens?: DraggableLens
  yLens?: DraggableLens
}

const defaultLens: DraggableLens = {
  get: () => 0,
  set: noop,
}

export function createDraggable({
  element,
  onDragStart = noop,
  onDrag = noop,
  onDragEnd = noop,
  xLens = defaultLens,
  yLens = defaultLens,
}: DraggableProps) {
  let startX = 0
  let startY = 0
  let x: number = 0
  let y: number = 0
  let relativeX: number = 0
  let relativeY: number = 0

  element.addEventListener('mousedown', handleStart)

  function onStart(e: MouseEvent | Touch) {
    const { scrollLeft, scrollTop, clientLeft, clientTop } = document.body

    relativeX = e.pageX - (element.offsetLeft + scrollLeft - clientLeft)
    relativeY = e.pageY - (element.offsetTop + scrollTop - clientTop)

    startX = xLens.get()
    startY = yLens.get()

    onDragStart(startX, startY)
  }

  function onMove(e: MouseEvent | Touch) {
    x = startX + e.pageX - relativeX
    y = startY + e.pageY - relativeY

    xLens.set(x)
    yLens.set(y)

    onDrag(x, y)
  }

  function handleStart(e: MouseEvent | TouchEvent) {
    if (isMouseEvent(e)) {
      if (e.button !== 0) return
      onStart(e)
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleStop)
    } else {
      onStart(e.touches[0])
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleStop, { passive: false })
    }
    e.preventDefault()
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    onMove(isMouseEvent(e) ? e : e.touches[0])

    e.preventDefault()
  }

  function dispose() {
    element.removeEventListener('mousedown', handleStart)
    element.removeEventListener('touchstart', handleStart)
  }

  function handleStop(e: MouseEvent | TouchEvent) {
    onDragEnd(x, y)

    if (isMouseEvent(e)) {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleStop)
    } else {
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleStop)
    }

    e.preventDefault()
  }

  return {
    dispose,
  }
}
