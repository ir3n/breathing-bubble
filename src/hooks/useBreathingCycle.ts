import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 3;

export type BreathingPhase = "countdown" | "inhale" | "hold" | "exhale";

type BreathingCycleOptions = {
  countdown: boolean;
  inhale: number;
  hold: number;
  exhale: number;
  repeats: number;
  onComplete?: () => void;
};

function toWholeNumber(value: number) {
  return Math.max(0, Math.round(value));
}

export function useBreathingCycle(options: BreathingCycleOptions) {
  const { countdown, onComplete } = options;
  const inhale = toWholeNumber(options.inhale);
  const hold = toWholeNumber(options.hold);
  const exhale = toWholeNumber(options.exhale);
  const repeats = toWholeNumber(options.repeats);

  const [seconds, setSeconds] = useState(0);

  const countdownLength = countdown ? COUNTDOWN_SECONDS : 0;
  const cycleLength = inhale + hold + exhale;
  const totalLength = countdownLength + cycleLength * repeats;
  const isComplete = seconds >= totalLength;

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (isComplete) onCompleteRef.current?.();
  }, [isComplete]);

  if (seconds < countdownLength) {
    return {
      phase: "countdown" as BreathingPhase,
      counter: countdownLength - seconds,
      progress: 0,
      currentRepeat: 1,
      totalRepeats: repeats,
      isComplete,
    };
  }

  const time = Math.min(seconds, totalLength - 1) - countdownLength;
  const currentRepeat = Math.floor(time / cycleLength) + 1;
  const timeInCycle = time % cycleLength;

  let phase: BreathingPhase;
  let secondInPhase: number;
  let phaseLength: number;

  if (timeInCycle < inhale) {
    phase = "inhale";
    secondInPhase = timeInCycle;
    phaseLength = inhale;
  } else if (timeInCycle < inhale + hold) {
    phase = "hold";
    secondInPhase = timeInCycle - inhale;
    phaseLength = hold;
  } else {
    phase = "exhale";
    secondInPhase = timeInCycle - inhale - hold;
    phaseLength = exhale;
  }

  return {
    phase,
    counter: secondInPhase + 1,
    progress: (secondInPhase + 1) / phaseLength,
    currentRepeat,
    totalRepeats: repeats,
    isComplete,
  };
}
