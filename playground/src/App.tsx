import { BreathingBubble } from "../../src/BreathingBubble";

export default function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <BreathingBubble
        size={400}
        inhale={4}
        hold={4}
        exhale={4}
        repeats={3}
        onComplete={() => console.log("done")}
      />
    </div>
  );
}
