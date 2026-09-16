/*
 * Unit tests for the timing logic.
 *
 * - renderHook() runs the hook inside a tiny test component so we can read what it returns.
 * - vi.useFakeTimers() replaces setInterval with a fake clock, so advance(10) jumps
 *   10 seconds instantly instead of the test actually waiting.
 * - act() tells React to finish re-rendering before we check the result.
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBreathingCycle } from "../src/hooks/useBreathingCycle";

type Options = Parameters<typeof useBreathingCycle>[0];

const defaults: Options = {
  countdown: true,
  inhale: 4,
  hold: 4,
  exhale: 4,
  repeats: 2,
  paused: false,
};

function setup(options: Partial<Options> = {}) {
  return renderHook((props: Options) => useBreathingCycle(props), {
    initialProps: { ...defaults, ...options },
  });
}

function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

describe("useBreathingCycle", () => {
  it("starts with a 3-second countdown", () => {
    const { result } = setup();

    expect(result.current.phase).toBe("countdown");
    expect(result.current.counter).toBe(3);

    advance(2);
    expect(result.current.counter).toBe(1);
  });

  it("goes through inhale, hold and exhale, counting up in each", () => {
    const { result } = setup();

    advance(3);
    expect(result.current).toMatchObject({ phase: "inhale", counter: 1 });

    advance(3);
    expect(result.current).toMatchObject({ phase: "inhale", counter: 4 });

    advance(1);
    expect(result.current).toMatchObject({ phase: "hold", counter: 1 });

    advance(4);
    expect(result.current).toMatchObject({ phase: "exhale", counter: 1 });
  });

  it("starts at inhale when countdown is off", () => {
    const { result } = setup({ countdown: false });

    expect(result.current).toMatchObject({ phase: "inhale", counter: 1 });
  });

  it("moves to the next repeat after a full cycle", () => {
    const { result } = setup({ countdown: false });

    expect(result.current.currentRepeat).toBe(1);
    advance(12);
    expect(result.current).toMatchObject({ phase: "inhale", currentRepeat: 2 });
  });

  it("skips the hold when it is 0", () => {
    const { result } = setup({ countdown: false, hold: 0 });

    advance(4);
    expect(result.current.phase).toBe("exhale");
  });

  it("rounds durations and repeats to whole numbers", () => {
    const { result } = setup({
      countdown: false,
      inhale: 3.6,
      hold: 0.4,
      exhale: 4.5,
      repeats: 1.6,
    });

    expect(result.current.totalRepeats).toBe(2);
    advance(4);
    expect(result.current.phase).toBe("exhale");
    advance(4);
    expect(result.current).toMatchObject({ phase: "exhale", counter: 5 });
  });

  it("reports progress through the current step", () => {
    const { result } = setup({ countdown: false });

    expect(result.current.progress).toBe(0.25);
    advance(3);
    expect(result.current.progress).toBe(1);
  });

  it("completes after all repeats and stays on the last second", () => {
    const { result } = setup();

    advance(3 + 12 * 2 - 1);
    expect(result.current.isComplete).toBe(false);

    advance(1);
    expect(result.current).toMatchObject({
      isComplete: true,
      phase: "exhale",
      counter: 4,
      currentRepeat: 2,
    });

    advance(30);
    expect(result.current).toMatchObject({ phase: "exhale", counter: 4 });
  });

  it("calls onComplete exactly once", () => {
    const onComplete = vi.fn();
    setup({ countdown: false, repeats: 1, onComplete });

    advance(11);
    expect(onComplete).not.toHaveBeenCalled();

    advance(1);
    advance(10);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete once even when the parent passes a new function every render", () => {
    const calls: number[] = [];
    const { rerender } = setup({
      countdown: false,
      repeats: 1,
      onComplete: () => calls.push(1),
    });

    for (let second = 0; second < 20; second++) {
      rerender({
        ...defaults,
        countdown: false,
        repeats: 1,
        onComplete: () => calls.push(second),
      });
      advance(1);
    }

    expect(calls).toHaveLength(1);
  });

  it("does not restart the timer when the parent re-renders", () => {
    const { result, rerender } = setup({ countdown: false });

    advance(2.5);
    rerender({ ...defaults, countdown: false, onComplete: () => {} });
    advance(0.5);

    expect(result.current.counter).toBe(4);
  });

  it("stops counting while paused and continues when resumed", () => {
    const { result, rerender } = setup({ countdown: false });

    advance(2);
    rerender({ ...defaults, countdown: false, paused: true });
    advance(10);
    expect(result.current).toMatchObject({ phase: "inhale", counter: 3 });

    rerender({ ...defaults, countdown: false, paused: false });
    advance(1);
    expect(result.current.counter).toBe(4);
  });

  it("never completes when repeats is Infinity", () => {
    const { result } = setup({ countdown: false, repeats: Infinity });

    advance(10_000);
    expect(result.current.isComplete).toBe(false);
    expect(Number.isFinite(result.current.counter)).toBe(true);
  });

  it("completes straight away without breaking when there is nothing to breathe", () => {
    const onComplete = vi.fn();
    const { result } = setup({
      countdown: false,
      inhale: 0,
      hold: 0,
      exhale: 0,
      onComplete,
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.counter).toBe(0);
    expect(Number.isNaN(result.current.progress)).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
