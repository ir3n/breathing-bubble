import { useId } from "react";
import "./BubbleShape.css";

export type BubbleShapeProps = {
  color: string;
  float: boolean;
  rotate: boolean;
};

export function BubbleShape(props: BubbleShapeProps) {
  const { color, float, rotate } = props;
  // Unique per instance so multiple bubbles don't share one filter.
  // useId returns chars like ":" that aren't safe inside url(#...), so strip them.
  const filterId = `bubble-rim-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div className={float ? "breathing-bubble__float" : undefined}>
      <svg
        viewBox="0 0 1080 1080"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={rotate ? "breathing-bubble__rotate" : undefined}
      >
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="1080"
            height="1080"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology
              operator="erode"
              radius="13"
              in="SourceAlpha"
              result="eroded"
            />
            <feGaussianBlur stdDeviation="50" in="eroded" result="blurred" />
            <feComposite
              in="SourceAlpha"
              in2="blurred"
              operator="out"
              result="rimAlpha"
            />
            <feFlood floodColor={color} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="rimAlpha" operator="in" />
          </filter>
        </defs>
        <circle
          cx="540"
          cy="540"
          r="540"
          fill={color}
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  );
}
