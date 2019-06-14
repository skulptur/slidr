import { applyResistance } from '../lib/utils'

describe('resist', () => {
  it('resistance clamps the value to the max limit', () => {
    expect(applyResistance(0, 10, 1, 50)).toBe(10)
    expect(applyResistance(0, -10, 1, 50)).toBe(0)
  })

  it('interpolates between the limit and the max limit according to resistance', () => {
    expect(applyResistance(0, 10, 1, 5)).toBe(5)
    expect(applyResistance(0, 10, 2, 5)).toBe(2.5)
    expect(applyResistance(0, 10, 4, 5)).toBe(1.25)
  })

  it('resistance works with negative numbers as well', () => {
    expect(applyResistance(0, -10, 1, -50)).toBe(-10)
    expect(applyResistance(-100, -10, 1, -150)).toBe(-110)
  })
})
