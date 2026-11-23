import type { CSSProperties } from "react";

interface SplitCharsProps {
  text: string;
  startIndex?: number;
}

export default function SplitChars({ text, startIndex = 0 }: SplitCharsProps) {
  let idx = startIndex;

  return (
    <>
      {Array.from(text).map((ch, i) => {
        if (ch === " ") {
          return <span key={`sp-${i}`}>{" "}</span>;
        }
        const style = { "--i": idx++ } as CSSProperties;
        return (
          <span key={`ch-${i}`} className="chm" aria-hidden="true">
            <span className="chi" style={style}>
              {ch}
            </span>
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </>
  );
}
