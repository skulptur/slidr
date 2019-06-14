export const velocityCalculator = (initValue: number) => {
  let lastValue = initValue
  let lastTimestamp = performance.now()

  return (newValue: number) => {
    const newTimestamp = performance.now()
    const interval = newTimestamp - lastTimestamp
    const difference = newValue - lastValue
    lastValue = newValue
    lastTimestamp = newTimestamp

    const velocity = (Math.sqrt(difference * difference) / interval) * Math.sign(difference)

    return velocity
  }
}
