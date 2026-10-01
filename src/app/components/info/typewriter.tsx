"use client";

import { useEffect, useState } from "react";

const WORDS = ["Next.js", "React", "Node.js", "TypeScript", "Nest.js", "SQL"];

// Escribe y borra cada palabra en loop.
export default function Typewriter() {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const word = WORDS[index];

  useEffect(() => {
    let delay = deleting ? 45 : 95;
    if (!deleting && length === word.length) delay = 1600;
    if (deleting && length === 0) delay = 300;

    const timer = window.setTimeout(() => {
      if (!deleting && length === word.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % WORDS.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [length, deleting, word]);

  return (
    <span className="typewriter" aria-label={WORDS.join(", ")}>
      <span aria-hidden>{word.slice(0, length)}</span>
      <span className="typewriter-caret" aria-hidden />
    </span>
  );
}
