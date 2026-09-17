import { useEffect, type RefObject } from "react";

// Set on .breathing-bubble in BreathingBubble.css. If it's missing, the stylesheet wasn't imported.
export const STYLESHEET_MARKER = "--breathing-bubble-styles";

// The stylesheet can't disappear once loaded, so one check per page is enough
let hasChecked = false;

export function useStylesheetCheck(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    // Skipped in tests, where CSS is usually not loaded
    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "test"
    ) {
      return;
    }
    if (hasChecked || !ref.current) return;
    hasChecked = true;

    const marker = getComputedStyle(ref.current)
      .getPropertyValue(STYLESHEET_MARKER)
      .trim();
    if (marker) return;

    console.warn(
      "[react-breathing-bubble] Styles not found. Import the stylesheet in your app's entry file or in the file where you use the component:\n\n" +
        '  import "@ir3n/react-breathing-bubble/styles.css";\n\n' +
        "Without it the bubble jumps between sizes instead of transitioning smoothly, and the counter and progress dots won't display correctly. 🫧",
    );
  }, [ref]);
}

// For tests only
export function resetStylesheetCheck() {
  hasChecked = false;
}
