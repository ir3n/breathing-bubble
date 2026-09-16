import type { CSSProperties } from "react";
import { BubbleShape } from "./BubbleShape";
import { BreathingProgress } from "./BreathingProgress";
import {
  useBreathingCycle,
  type BreathingPhase,
} from "./hooks/useBreathingCycle";
import "./BreathingBubble.css";

export type BreathingBubbleProps = {
  inhale?: number;
  hold?: number;
  exhale?: number;
  repeats?: number;
  countdown?: boolean;
  countdownText?: string;
  inhaleText?: string;
  holdText?: string;
  exhaleText?: string;
  bubbleColor?: string;
  float?: boolean;
  rotate?: boolean;
  showProgress?: boolean;
  progressColor?: string;
  progressLabel?: (currentRepeat: number, totalRepeats: number) => string;
  paused?: boolean;
  onComplete?: () => void;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
};

const SHRINK_AMOUNT = 0.2;

function getScale(phase: BreathingPhase, progress: number) {
  if (phase === "inhale") return 1 - SHRINK_AMOUNT * (1 - progress);
  if (phase === "exhale") return 1 - SHRINK_AMOUNT * progress;
  if (phase === "hold") return 1;
  return 1 - SHRINK_AMOUNT;
}

function defaultProgressLabel(currentRepeat: number, totalRepeats: number) {
  return `Cycle ${currentRepeat} of ${totalRepeats}`;
}

export function BreathingBubble(props: BreathingBubbleProps) {
  const {
    inhale = 4,
    hold = 4,
    exhale = 4,
    repeats = 3,
    countdown = true,
    countdownText = "Ready...",
    inhaleText = "Breathe in...",
    holdText = "Hold...",
    exhaleText = "Breathe out...",
    bubbleColor = "#0077b6",
    float = true,
    rotate = true,
    showProgress = true,
    progressColor = "#0077b6",
    progressLabel = defaultProgressLabel,
    paused = false,
    onComplete,
    size,
    className,
    style,
  } = props;

  const { phase, counter, progress, currentRepeat, totalRepeats } =
    useBreathingCycle({
      countdown,
      inhale,
      hold,
      exhale,
      repeats,
      paused,
      onComplete,
    });

  const text = {
    countdown: countdownText,
    inhale: inhaleText,
    hold: holdText,
    exhale: exhaleText,
  }[phase];

  const rootClassName = [
    "breathing-bubble",
    paused && "breathing-bubble--paused",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} style={{ width: size, ...style }}>
      <p
        className="breathing-bubble__title"
        aria-live="polite"
        aria-atomic="true"
      >
        {text}
      </p>
      <div className="breathing-bubble__stage">
        <div className="breathing-bubble__shape-wrapper">
          <div
            className="breathing-bubble__shape-inner"
            style={{ transform: `scale(${getScale(phase, progress)})` }}
          >
            <BubbleShape color={bubbleColor} float={float} rotate={rotate} />
          </div>
        </div>
        <div className="breathing-bubble__counter" aria-hidden="true">
          {counter > 0 && counter}
        </div>
      </div>
      {showProgress && phase !== "countdown" && totalRepeats !== Infinity && (
        <BreathingProgress
          repeats={totalRepeats}
          currentRepeat={currentRepeat}
          color={progressColor}
          label={progressLabel(currentRepeat, totalRepeats)}
        />
      )}
    </div>
  );
}
