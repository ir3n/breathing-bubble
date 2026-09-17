# 🫧 react-breathing-bubble

An animated breathing bubble React component for guided breathing exercises. The bubble grows as you breathe in, rests while you hold, and shrinks as you breathe out.

## Installation

```bash
npm install @ir3n/react-breathing-bubble
```

Requires React 18 or newer.

> [!IMPORTANT]
> **Import the stylesheet once in your app.** The styles are not included in the JavaScript, so without this the bubble jumps between sizes instead of growing and shrinking smoothly, and the counter and progress dots won't display correctly:
>
> ```tsx
> import "@ir3n/react-breathing-bubble/styles.css";
> ```
>
> You can import it once in your app's entry file (e.g. `app/layout.tsx` in Next.js or `main.tsx` in Vite), or in the file where you use the component. If you override the styles, make sure your CSS loads after this stylesheet. In development, the component logs a console warning if the styles are missing.

## Usage

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

| Prop            | Type                                         | Default                              | Description                                                                 |
| --------------- | -------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `inhale`        | `number`                                     | `4`                                  | Seconds to breathe in.                                                      |
| `hold`          | `number`                                     | `4`                                  | Seconds to hold after breathing in. `0` skips the hold.                     |
| `exhale`        | `number`                                     | `4`                                  | Seconds to breathe out.                                                     |
| `repeats`       | `number`                                     | `3`                                  | Number of full cycles. Pass `Infinity` to loop until unmounted.             |
| `countdown`     | `boolean`                                    | `true`                               | Show a 3-second countdown before starting.                                  |
| `countdownText` | `string`                                     | `"Ready..."`                         | Text shown during the countdown.                                            |
| `inhaleText`    | `string`                                     | `"Breathe in..."`                    | Text shown while breathing in.                                              |
| `holdText`      | `string`                                     | `"Hold..."`                          | Text shown while holding.                                                   |
| `exhaleText`    | `string`                                     | `"Breathe out..."`                   | Text shown while breathing out.                                             |
| `bubbleColor`   | `string`                                     | `"#0077b6"`                          | Any CSS color.                                                              |
| `float`         | `boolean`                                    | `true`                               | Gently float the bubble up and down.                                        |
| `rotate`        | `boolean`                                    | `true`                               | Slowly rotate the bubble.                                                   |
| `showProgress`  | `boolean`                                    | `true`                               | Show one dot per cycle. Hidden when `repeats` is `Infinity`.                |
| `progressColor` | `string`                                     | `"#0077b6"`                          | Any CSS color.                                                              |
| `progressLabel` | `(current: number, total: number) => string` | `` `Cycle ${current} of ${total}` `` | Text read by screen readers for the progress dots. Use it to translate.     |
| `paused`        | `boolean`                                    | `false`                              | Pauses the timer and the float/rotate animations.                           |
| `onComplete`    | `() => void`                                 | –                                    | Called once when all cycles have finished.                                  |
| `size`          | `number \| string`                           | –                                    | Width of the component. Numbers are pixels. Fills its container if omitted. |
| `className`     | `string`                                     | –                                    | Added to the root element.                                                  |
| `style`         | `CSSProperties`                              | –                                    | Applied to the root element.                                                |

Durations and `repeats` are rounded to whole numbers.

## Notes

- **Restarting:** change the component's `key` to start the exercise again, e.g. `<BreathingBubble key={attempt} />`.
- **Styling:** every element has a `breathing-bubble__*` class you can target to override styles. Text inherits your font and color.

## Accessibility

- **Screen readers** hear each step ("Breathe in...", "Hold...") as it changes, and the progress dots are read as "Cycle 2 of 3". The per-second counter and the bubble graphic are hidden from screen readers to avoid noise.
- **Pause control:** the exercise moves automatically for more than 5 seconds, so [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) expects users to be able to pause it. Render your own button and pass `paused`:

  ```tsx
  const [paused, setPaused] = useState(false);

  <button type="button" onClick={() => setPaused((p) => !p)}>
    {paused ? "Resume" : "Pause"}
  </button>
  <BreathingBubble paused={paused} />
  ```

- **Reduced motion:** the float and rotate animations are turned off for users who prefer reduced motion. The breathing itself still grows and shrinks, as that is the exercise.
- **Colors:** check that `bubbleColor` and `progressColor` have at least 3:1 contrast against your background.
- **Translation:** all visible and screen reader text can be changed through the `*Text` props and `progressLabel`.
