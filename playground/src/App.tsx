import { useState } from "react";
import { BreathingBubble } from "../../src/BreathingBubble";

export default function App() {
  const [paused, setPaused] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <button type="button" onClick={() => setPaused((p) => !p)}>
        {paused ? "Resume" : "Pause"}
      </button>
      <BreathingBubble
        size={400}
        inhale={4}
        hold={4}
        exhale={4}
        repeats={3}
        paused={paused}
        onComplete={() => console.log("done")}
      />
    </div>
  );
}
