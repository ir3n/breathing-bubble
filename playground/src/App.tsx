import BreathingBubble from "../../src/BreathingBubble";

export default function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <BreathingBubble
        inhale={4}
        hold={4}
        exhale={4}
        repeats={5}
        onProcessEnd={() => console.log("done")}
      />
    </div>
  );
}
