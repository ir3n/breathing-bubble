/*
 * Component tests: render <BreathingBubble /> in a simulated browser (jsdom)
 * and check what a user, or a screen reader, would get.
 *
 * - screen.getByText / getByRole find elements the way a person would, by
 *   visible text or accessible role, instead of by CSS class.
 * - The accessibility tests run axe-core, the same engine as browser a11y
 *   extensions, over the rendered HTML.
 */
import { act, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BreathingBubble } from "../src/BreathingBubble";

function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

describe("BreathingBubble", () => {
  describe("with a fake clock", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("shows the countdown, then the breathing steps", () => {
      render(<BreathingBubble />);

      expect(screen.getByText("Ready...")).toBeInTheDocument();
      advance(3);
      expect(screen.getByText("Breathe in...")).toBeInTheDocument();
      advance(4);
      expect(screen.getByText("Hold...")).toBeInTheDocument();
      advance(4);
      expect(screen.getByText("Breathe out...")).toBeInTheDocument();
    });

    it("uses custom text", () => {
      render(
        <BreathingBubble
          countdownText="Prepárate"
          inhaleText="Inhala"
          holdText="Mantén"
          exhaleText="Exhala"
        />,
      );

      expect(screen.getByText("Prepárate")).toBeInTheDocument();
      advance(3);
      expect(screen.getByText("Inhala")).toBeInTheDocument();
      advance(4);
      expect(screen.getByText("Mantén")).toBeInTheDocument();
      advance(4);
      expect(screen.getByText("Exhala")).toBeInTheDocument();
    });

    it("shows the progress after the countdown with an accessible label", () => {
      render(<BreathingBubble repeats={3} />);

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      advance(3);
      expect(
        screen.getByRole("img", { name: "Cycle 1 of 3" }),
      ).toBeInTheDocument();
      advance(12);
      expect(
        screen.getByRole("img", { name: "Cycle 2 of 3" }),
      ).toBeInTheDocument();
    });

    it("translates the progress label", () => {
      render(
        <BreathingBubble
          countdown={false}
          progressLabel={(current, total) => `Ronda ${current} de ${total}`}
        />,
      );

      expect(
        screen.getByRole("img", { name: "Ronda 1 de 3" }),
      ).toBeInTheDocument();
    });

    it("hides the progress when showProgress is false or repeats is Infinity", () => {
      const { rerender } = render(
        <BreathingBubble countdown={false} showProgress={false} />,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();

      rerender(<BreathingBubble countdown={false} repeats={Infinity} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("stops on the current step while paused", () => {
      const { container, rerender } = render(
        <BreathingBubble countdown={false} paused />,
      );

      advance(20);
      expect(screen.getByText("Breathe in...")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("breathing-bubble--paused");

      rerender(<BreathingBubble countdown={false} />);
      expect(container.firstChild).not.toHaveClass("breathing-bubble--paused");
      advance(4);
      expect(screen.getByText("Hold...")).toBeInTheDocument();
    });

    it("calls onComplete once at the end", () => {
      const onComplete = vi.fn();
      render(
        <BreathingBubble countdown={false} repeats={1} onComplete={onComplete} />,
      );

      advance(11);
      expect(onComplete).not.toHaveBeenCalled();
      advance(10);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("sizing and styling", () => {
    it("uses size as the width, in pixels for numbers", () => {
      const { container, rerender } = render(<BreathingBubble size={200} />);
      const root = container.firstChild as HTMLElement;
      expect(root.style.width).toBe("200px");

      rerender(<BreathingBubble size="20rem" />);
      expect(root.style.width).toBe("20rem");
    });

    it("adds className and style to the root element", () => {
      const { container } = render(
        <BreathingBubble className="custom" style={{ marginTop: 10 }} />,
      );

      expect(container.firstChild).toHaveClass("breathing-bubble", "custom");
      expect(container.firstChild).toHaveStyle({ marginTop: "10px" });
    });

    it("gives each bubble its own SVG filter id", () => {
      const { container } = render(
        <>
          <BreathingBubble />
          <BreathingBubble />
        </>,
      );

      const ids = [...container.querySelectorAll("filter")].map((f) => f.id);
      expect(ids).toHaveLength(2);
      expect(ids[0]).not.toBe(ids[1]);
      container.querySelectorAll("circle").forEach((circle, index) => {
        expect(circle.getAttribute("filter")).toBe(`url(#${ids[index]})`);
      });
    });
  });

  describe("accessibility", () => {
    it("announces the step text politely", () => {
      render(<BreathingBubble />);

      const title = screen.getByText("Ready...");
      expect(title).toHaveAttribute("aria-live", "polite");
      expect(title).toHaveAttribute("aria-atomic", "true");
    });

    it("hides the decorative bubble and the per-second counter from screen readers", () => {
      const { container } = render(<BreathingBubble />);

      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(
        container.querySelector(".breathing-bubble__counter"),
      ).toHaveAttribute("aria-hidden", "true");
    });

    it.each([
      ["during the countdown", {}],
      ["while breathing, with progress", { countdown: false }],
    ])("has no axe violations %s", async (_, props) => {
      const { container } = render(<BreathingBubble {...props} />);

      const results = await axe.run(container, {
        rules: {
          // jsdom can't calculate colors, so contrast is checked by hand instead.
          "color-contrast": { enabled: false },
        },
      });

      expect(results.violations).toEqual([]);
    });
  });
});
