import {
  noop,
  clamp,
  getSnapValue,
  getActiveIndex,
  setElementWidth,
  getTotalWidth,
  getTranslateX,
  setTranslateX,
  getElementWidth,
  resist,
  limit,
} from './utils'
import { tween } from './tween'
import { inOutQuad, outQuad } from './ease'
import { createTouchScrollBlocker } from './createMobileScrollBlocker'
import { createDraggable } from './Draggable'
import { velocityCalculator } from './velocityCalculator'

type DraggableSliderProps = {
  slider: HTMLElement
  items: HTMLElement[]
  container: HTMLElement
  onIndexChange?: (id: number) => void
}

export type DraggableSlider = ReturnType<typeof createDraggableSlider>

export function createDraggableSlider({
  container,
  slider,
  items,
  onIndexChange = noop,
}: DraggableSliderProps) {
  let activeSlide: number = 0
  let cancelActiveTween = noop
  let velocity = 0
  const calculateVelocity = velocityCalculator(0)

  const mobileScrollBlocker = createTouchScrollBlocker({ element: container })
  const draggable = initDraggable()
  const tweenTime = 0.4
  const minX = getElementWidth(container) - getElementWidth(slider)

  function initDraggable() {
    setBounds()

    return createDraggable({
      element: slider,
      xLens: {
        get: () => getTranslateX(slider),
        set: (x: number) => {
          applyValue(x, true, true)
        },
      },
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    })
  }

  function handleDragStart() {
    mobileScrollBlocker.set({ preventVertical: true })
    cancelActiveTween()
  }

  function updateActiveSlide(x: number) {
    const index = getActiveIndex(minX, x, items)

    if (index !== activeSlide) {
      activeSlide = index
      onIndexChange(index)
    }
  }

  function handleDragEnd(_x: number) {
    // TODO: fix bug when scrolling left and the effect is stronger
    const x = limit(1, 1.5, -velocity) * clamp(minX, 0, _x)

    mobileScrollBlocker.set({ preventVertical: false })
    const snap = getSnapValue(minX, items, x)
    tweenTo(snap, tweenTime, outQuad)
  }

  function applyValue(value: number, applyResistance = false, calcVelocity = false) {
    velocity = calcVelocity ? calculateVelocity(value) : velocity
    const val = applyResistance ? resist(minX, 0, 200, 10, value) : value
    updateActiveSlide(val)
    setTranslateX(slider, val)
  }

  function setBounds() {
    setElementWidth(getTotalWidth(items), slider)
  }

  function update() {
    setBounds()
    goTo(activeSlide, 0)
  }

  function dispose() {
    mobileScrollBlocker.dispose()
    draggable.dispose()
  }

  function tweenTo(value: number, time = tweenTime, ease = inOutQuad) {
    cancelActiveTween()
    cancelActiveTween = tween({
      from: getTranslateX(slider),
      to: value,
      duration: time,
      ease,
      onUpdate: applyValue,
    })
  }

  function goTo(index: number, time = tweenTime) {
    activeSlide = clamp(0, items.length - 1, index)
    const x = clamp(minX, 0, -items[activeSlide].offsetLeft)

    tweenTo(x, time)

    onIndexChange(activeSlide)
  }

  function next() {
    goTo(activeSlide + 1)
  }

  function previous() {
    goTo(activeSlide - 1)
  }

  return {
    next,
    previous,
    dispose,
    goTo,
    update,
  }
}
