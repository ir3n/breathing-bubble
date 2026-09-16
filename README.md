# react-breathing-bubble

An animated breathing bubble React component for guided breathing exercises. The bubble grows as you breathe in, rests while you hold, and shrinks as you breathe out.

## Installation

```bash
npm install @ir3n/react-breathing-bubble
```

Requires React 18 or newer.

## Usage

Import the component **and its stylesheet**:

```tsx
import { BreathingBubble } from "@ir3n/react-breathing-bubble";
import "@ir3n/react-breathing-bubble/styles.css";

export default function App() {
  return (
    <BreathingBubble
      inhale={4}
      hold={4}
      exhale={4}
      repeats={5}
      size={300}
      onComplete={() => console.log("Done!")}
    />
  );
}
```

With no props, it runs a 3-second countdown followed by 3 cycles of 4-4-4 breathing.

## Props

| Prop            | Type               | Default            | Description                                                                 |
| --------------- | ------------------ | ------------------ | --------------------------------------------------------------------------- |
| `inhale`        | `number`           | `4`                | Seconds to breathe in.                                                      |
| `hold`          | `number`           | `4`                | Seconds to hold after breathing in. `0` skips the hold.                     |
| `exhale`        | `number`           | `4`                | Seconds to breathe out.                                                     |
| `repeats`       | `number`           | `3`                | Number of full cycles. Pass `Infinity` to loop until unmounted.             |
| `countdown`     | `boolean`          | `true`             | Show a 3-second countdown before starting.                                  |
| `countdownText` | `string`           | `"Ready..."`       | Text shown during the countdown.                                            |
| `inhaleText`    | `string`           | `"Breathe in..."`  | Text shown while breathing in.                                              |
| `holdText`      | `string`           | `"Hold..."`        | Text shown while holding.                                                   |
| `exhaleText`    | `string`           | `"Breathe out..."` | Text shown while breathing out.                                             |
| `bubbleColor`   | `string`           | `"#00bbff"`        | Any CSS color.                                                              |
| `float`         | `boolean`          | `true`             | Gently float the bubble up and down.                                        |
| `rotate`        | `boolean`          | `true`             | Slowly rotate the bubble.                                                   |
| `showProgress`  | `boolean`          | `true`             | Show one dot per cycle. Hidden when `repeats` is `Infinity`.                |
| `progressColor` | `string`           | `"#00bbff"`        | Any CSS color.                                                              |
| `onComplete`    | `() => void`       | –                  | Called once when all cycles have finished.                                  |
| `size`          | `number \| string` | –                  | Width of the component. Numbers are pixels. Fills its container if omitted. |
| `className`     | `string`           | –                  | Added to the root element.                                                  |
| `style`         | `CSSProperties`    | –                  | Applied to the root element.                                                |

Durations and `repeats` are rounded to whole numbers.

## Notes

- **Restarting:** change the component's `key` to start the exercise again, e.g. `<BreathingBubble key={attempt} />`.
- **Styling:** every element has a `breathing-bubble__*` class you can target to override styles. Text inherits your font and color.
- **Reduced motion:** the float and rotate animations are turned off for users who prefer reduced motion.
