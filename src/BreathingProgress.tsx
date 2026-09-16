import "./BreathingProgress.css";

export type BreathingProgressProps = {
  repeats: number;
  currentRepeat: number;
  color: string;
};

export function BreathingProgress(props: BreathingProgressProps) {
  const { repeats, currentRepeat, color } = props;

  return (
    <div className="breathing-bubble__progress" aria-hidden="true">
      {Array.from({ length: repeats }, (_, index) => {
        const isReached = index < currentRepeat;
        return (
          <div
            key={index}
            className={
              isReached
                ? "breathing-bubble__progress-dot"
                : "breathing-bubble__progress-dot breathing-bubble__progress-dot--inactive"
            }
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
