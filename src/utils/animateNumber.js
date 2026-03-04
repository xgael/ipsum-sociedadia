export function animateNumber(element, targetValue, finalText = null) {
  let current = 0
  const increment = Math.ceil(targetValue / 20)
  if (targetValue === 0) {
    element.innerText = finalText || '0'
    return () => {}
  }
  const timer = setInterval(() => {
    current += increment
    if (current >= targetValue) {
      current = targetValue
      clearInterval(timer)
      element.innerText = finalText || current
    } else {
      element.innerText = current
    }
  }, 30)
  return () => clearInterval(timer)
}
