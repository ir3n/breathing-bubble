import "./BreathingProgress.css";

export type BreathingProgressProps = {
  repeats: number;
  currentRepeat: number;
  color: string;
  label: string;
};

export function BreathingProgress(props: BreathingProgressProps) {
  const { repeats, currentRepeat, color, label } = props;

  return (
    <div className="breathing-bubble__progress" role="img" aria-label={label}>
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
