// tslint:disable-next-line: no-empty
export const noop = (): void => {}

export const clamp = (min: number, max: number, val: number): number => {
  return Math.min(Math.max(val, min), max)
}

export const limit = (min: number, max: number, value: number): number => {
  return value < 0 ? clamp(-min, -max, value) : clamp(min, max, value)
}

export const getElementWidth = (element: HTMLElement): number => {
  return element.getBoundingClientRect().width
}

export const setElementWidth = (width: number, element: HTMLElement): void => {
  element.style.width = `${width}px`
}

export const getSnapValue = (minX: number, slides: HTMLElement[], x: number): number => {
  const progress = clamp(0, 1, x / minX)
  // snaps to the right instead
  if (progress === 1) return minX

  const _x = x * -1

  const element = slides.find((element) => element.offsetLeft + getElementWidth(element) / 2 >= _x)

  return element ? -element.offsetLeft : 0
}

export const getActiveIndex = (minX: number, x: number, slides: HTMLElement[]): number => {
  const value = clamp(0, Math.abs(minX), Math.abs(x))

  return slides.findIndex((element) => element.offsetLeft >= value)
}

export const getTotalWidth = (slides: HTMLElement[]): number => {
  return slides.reduce((acc, item) => {
    return acc + getElementWidth(item)
  }, 0)
}

export const getTranslateX = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)
  // tslint:disable-next-line: deprecation
  const matrix = new DOMMatrix(style.webkitTransform)

  return matrix.m41
}

export const setTranslateX = (element: HTMLElement, x: number) => {
  element.style.transform = `translateX(${x}px)`
}

export const isMouseEvent = (obj: any): obj is MouseEvent => obj instanceof MouseEvent

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

export const applyResistance = (
  limit: number,
  maxDistance: number,
  resistance: number,
  value: number
): number => {
  const maxDist = limit + maxDistance
  const diff = value - limit

  return lerp(limit, maxDist, clamp(0, 1, diff / (maxDistance * resistance)))
}

export const resist = (
  min: number,
  max: number,
  maxDistance: number,
  resistance: number,
  value: number
): number => {
  return value > max
    ? applyResistance(max, maxDistance, resistance, value)
    : value < min
    ? applyResistance(min, -maxDistance, resistance, value)
    : value
}
