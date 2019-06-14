# Slidr

This slider librart is about doing only as much as it needs to and then getting out of your way. It's tiny, it's flexible, and there are no external dependencies. Oh and you'll have to provide your own markup and styles, using whatever view framework you prefer (or none).

Usage:

```typescript
import { createDraggableSlider } from 'slidr'

createDraggableSlider({
  container: mySliderContainer,
  slider: mySliderHtmlElement,
  items: myArrayOfHtmlElements,
  onIndexChange: (currentId) => {
    console.log(currentId)
  },
})
```
