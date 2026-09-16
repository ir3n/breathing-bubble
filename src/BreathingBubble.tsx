import { useEffect, useState } from "react";
import { BubbleShape } from "./BubbleShape";
import { BreathingProgress } from "./BreathingProgress";
import "./BreathingBubble.css";

export type BreathingBubbleProps = {
  bubbleColor?: string;
  countdown?: boolean;
  float?: boolean;
  rotate?: boolean;
  inhale: number;
  hold: number;
  exhale: number;
  inhaleText?: string;
  holdText?: string;
  exhaleText?: string;
  repeats: number;
  showProgress?: boolean;
  progressColor?: string;
  onProcessEnd: () => void;
};

export function BreathingBubble(props: BreathingBubbleProps) {
  const {
    bubbleColor = "#00bbff",
    float = true,
    rotate = true,
    countdown = true,
    inhale,
    hold,
    exhale,
    inhaleText = "Breathe in...",
    holdText = "Hold...",
    exhaleText = "Breathe out...",
    repeats,
    showProgress = true,
    progressColor = "#00bbff",
    onProcessEnd,
  } = props;

  const [inCountdown, setInCountdown] = useState(countdown ? true : false);
  const [secondsCounter, setSecondsCounter] = useState(countdown ? 3 : 1);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [currentStepId, setCurrentStepId] = useState(0);

  const BreathingSteps = [
    { type: "inhale", duration: inhale, text: inhaleText },
    { type: "hold", duration: hold, text: holdText },
    { type: "exhale", duration: exhale, text: exhaleText },
  ];

  const currentStep = BreathingSteps[currentStepId];

  // TODO: refactor, separate concerns

  useEffect(() => {
    if (!countdown || !inCountdown) return;
    const countdownInterval = setInterval(() => {
      if (secondsCounter > 1) {
        setSecondsCounter((counter) => counter - 1);
      } else {
        setInCountdown(false);
        setSecondsCounter(1);
        clearInterval(countdownInterval);
      }
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [countdown, secondsCounter, inCountdown]);

  useEffect(() => {
    if (inCountdown) return;
    const counter = setInterval(() => {
      if (secondsCounter < currentStep.duration) {
        setSecondsCounter((counter) => counter + 1);
      } else {
        if (currentStepId < BreathingSteps.length - 1) {
          setCurrentStepId((stepId) => stepId + 1);
          setSecondsCounter(1);
        } else {
          if (currentRepeat < repeats) {
            setCurrentRepeat((repeat) => repeat + 1);
            setCurrentStepId(0);
            setSecondsCounter(1);
          } else {
            onProcessEnd();
            clearInterval(counter);
          }
        }
      }
    }, 1000);
    return () => clearInterval(counter);
  }, [
    currentRepeat,
    currentStep.duration,
    currentStepId,
    inCountdown,
    secondsCounter,
    repeats,
    BreathingSteps.length,
    onProcessEnd,
  ]);

  let scale = 1 - inhale * 0.05;

  if (!inCountdown) {
    switch (currentStep.type) {
      case "inhale":
        scale = scale + secondsCounter * 0.05;
        break;
      case "exhale":
        scale = 1 - secondsCounter * 0.05;
        break;
      case "hold":
        scale = 1;
        break;
    }
  }

  return (
    <div className="breathing-bubble">
      <h3>{inCountdown ? "Ready..." : currentStep.text}</h3>
      <div className="breathing-bubble__stage">
        {/* TODO: The width is given in this class. Maybe make it so that it takes the full width of the container */}
        <div className="breathing-bubble__shape-wrapper">
          <div
            className="breathing-bubble__shape-inner"
            style={{ transform: `scale(${scale})` }}
          >
            <BubbleShape color={bubbleColor} float={float} rotate={rotate} />
          </div>
        </div>
        <div className="breathing-bubble__counter">
          {secondsCounter && secondsCounter}
        </div>
      </div>
      {showProgress && !inCountdown && (
        <BreathingProgress
          repeats={repeats}
          currentRepeat={currentRepeat}
          color={progressColor}
        />
      )}
    </div>
  );
}
