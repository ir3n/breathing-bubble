import "./BreathingProgress.css";

export type BreathingProgressProps = {
  repeats: number;
  currentRepeat: number;
  color: string;
};

export default function BreathingProgress(props: BreathingProgressProps) {
  const { repeats, currentRepeat, color } = props;

  return (
    <div className="breathing-bubble__progress">
      {Array.from({ length: repeats }, (_, index) => {
        const isDone = index < currentRepeat;
        return (
          <div
            key={index}
            className={`breathing-bubble__progress-dot ${
              isDone
                ? "breathing-bubble__progress-dot--active"
                : "breathing-bubble__progress-dot--inactive"
            }`}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
