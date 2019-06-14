/* tslint:disable */
export const linear = (t: number) => t

export const inQuad = (t: number) => t * t

export const outQuad = (t: number) => t * (2 - t)

export const inOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

export const inCubic = (t: number) => t * t * t

export const outCubic = (t: number) => --t * t * t + 1

export const inOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

export const inQuart = (t: number) => t * t * t * t

export const outQuart = (t: number) => 1 - --t * t * t * t

export const inOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t)

export const inQuint = (t: number) => t * t * t * t * t

export const outQuint = (t: number) => 1 + --t * t * t * t * t

export const inOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

export const inElastic = (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1

export const outElastic = (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t)

export const inOutElastic = (t: number) =>
  (t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1
