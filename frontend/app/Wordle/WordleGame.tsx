"use client";

import React, { useState, useEffect } from "react";
import {
  Puzzle,
  Phoneme,
  EvaluationResult,
  KeyboardState,
  evaluateGuess,
  updateKeyboardState,
  checkGameStatus,
} from "./WordleEngine";

const KEYBOARD_ROWS: Phoneme[][] = [
  ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "s", "t", "v", "w", "z"],
  ["dʒ", "tʃ", "ð", "θ", "ŋ", "ɹ", "ʃ", "ɡ"],
  ["e", "iː", "oɪ", "oː", "æ", "æɔ", "æɪ", "ɐ", "ɐː", "ɑe", "ɔ", "əʉ", "ɜː", "ɪ", "ɪə", "ʉː", "ʊ"],
];

const ALL_PHONEMES = KEYBOARD_ROWS.flat();

const initialKeyboard = (): KeyboardState =>
  Object.fromEntries(ALL_PHONEMES.map((p) => [p, null]));

const RESULT_BG: Record<string, string> = {
  green: "#16a34a",
  yellow: "#eab308",
  grey: "#4b5563",
};

const cellStyle = (result?: string): React.CSSProperties =>
  result ? { backgroundColor: RESULT_BG[result], borderColor: RESULT_BG[result], color: "#fff" } : {};

const keyBg = (state: string | null): React.CSSProperties => {
  if (state === "green") return { backgroundColor: "#16a34a", borderColor: "#16a34a", color: "#fff" };
  if (state === "yellow") return { backgroundColor: "#eab308", borderColor: "#eab308", color: "#fff" };
  if (state === "grey") return { backgroundColor: "#374151", borderColor: "#374151", color: "#9ca3af" };
  return {};
};

interface Props {
  puzzle: Puzzle;
  onClose: () => void;
}

export default function WordleGame({ puzzle, onClose }: Props) {
  const { solution, maxGuesses, showHints } = puzzle;
  const phonemeLength = solution.phonemes.length;

  const [guesses, setGuesses] = useState<EvaluationResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Phoneme[]>([]);
  const [keyboard, setKeyboard] = useState<KeyboardState>(initialKeyboard());
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [error, setError] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (status === "won") {
      setShowCongrats(true);
      const t = setTimeout(() => setShowCongrats(false), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const addPhoneme = (p: Phoneme) => {
    if (status !== "playing" || currentGuess.length >= phonemeLength) return;
    setCurrentGuess((prev) => [...prev, p]);
    setError("");
  };

  const backspace = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
    setError("");
  };

  const submit = () => {
    if (status !== "playing") return;
    if (currentGuess.length !== phonemeLength) {
      setError(`Need ${phonemeLength} phonemes`);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, solution.phonemes);
    const newGuesses = [...guesses, { guess: currentGuess, result: evaluation }];
    const newKeyboard = updateKeyboardState(keyboard, currentGuess, evaluation);
    // pass newGuesses.length so count reflects the just-submitted guess
    const newStatus = checkGameStatus(currentGuess, solution.phonemes, newGuesses.length, maxGuesses);

    setGuesses(newGuesses);
    setKeyboard(newKeyboard);
    setStatus(newStatus);
    setCurrentGuess([]);
  };



  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-[var(--card-bg)] border border-yellow-500 rounded-2xl px-10 py-8 flex flex-col items-center gap-3 shadow-2xl animate-bounce">
            <span className="text-5xl">🏆</span>
            <span className="text-2xl font-bold text-yellow-400">Congratulations!</span>
            <span className="text-[var(--muted-text)] text-sm">You got it!</span>
          </div>
        </div>
      )}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 w-full max-w-lg text-[var(--page-text)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Phoneme Wordle — {phonemeLength} phonemes</h2>
          <button onClick={onClose} className="text-[var(--muted-text)] hover:text-[var(--page-text)] text-xl leading-none">✕</button>
        </div>

        {/* Colour legend */}
        <div className="flex gap-4 justify-center text-xs mb-4">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-600 inline-block" /> Correct position</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-yellow-500 inline-block" /> Wrong position</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-600 inline-block" /> Not in word</span>
        </div>

        {showHints && status === "playing" && (
          <p className="text-center text-gray-400 text-sm mb-3">
            Hint: <span className="font-mono text-teal-400">{solution.word}</span>
          </p>
        )}

        {/* Guess grid */}
        <div className="flex flex-col gap-1 mb-4 items-center">
          {Array.from({ length: maxGuesses }).map((_, rowIdx) => {
            const committed = guesses[rowIdx];
            const isCurrent = rowIdx === guesses.length && status === "playing";
            return (
              <div key={rowIdx} className="flex gap-1">
                {Array.from({ length: phonemeLength }).map((_, colIdx) => {
                  const phoneme = committed
                    ? committed.guess[colIdx]
                    : isCurrent
                    ? currentGuess[colIdx]
                    : undefined;
                  const result = committed?.result[colIdx];
                  return (
                    <div
                      key={colIdx}
                      style={cellStyle(result)}
                      className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-mono font-bold rounded
                        ${!result && isCurrent && phoneme ? "border-[var(--border)] text-[var(--page-text)]" : ""}
                        ${!result && !phoneme ? "border-[var(--border)] text-[var(--muted-text)]" : ""}`}
                    >
                      {phoneme ?? ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Status / error */}
        {error && <p className="text-center text-red-400 text-sm mb-2">{error}</p>}
        {status === "won" && (
          <p className="text-center text-green-400 font-bold mb-2">
            You got it! — <span className="font-mono">{solution.word}</span>
          </p>
        )}
        {status === "lost" && (
          <p className="text-center text-red-400 font-bold mb-2">
            Game over! The word was{" "}
            <span className="font-mono">{solution.word}</span>{" "}
            <span className="text-[var(--muted-text)] font-normal">[{solution.phonemes.join(" ")}]</span>
          </p>
        )}

        {/* Phoneme keyboard */}
        <div className="flex flex-col gap-1 mt-3">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center flex-wrap">
              {row.map((p) => (
                <button
                  key={p}
                  onClick={() => addPhoneme(p)}
                  disabled={status !== "playing"}
                  style={keyBg(keyboard[p])}
                  className="px-2 py-2 rounded text-xs font-mono min-w-[2.5rem] border border-[var(--border)] bg-[var(--chrome-bg)] text-[var(--page-text)] transition-colors disabled:cursor-not-allowed hover:bg-[var(--key-hover-bg)]"
                >
                  {p}
                </button>
              ))}
            </div>
          ))}

          <div className="flex gap-3 justify-center mt-2">
            <button
              onClick={backspace}
              disabled={status !== "playing"}
              className="px-5 py-2 rounded bg-[var(--card-bg)] hover:bg-[var(--chrome-bg)] disabled:opacity-50 text-[var(--page-text)] text-sm"
            >
              ⌫ Back
            </button>
            <button
              onClick={submit}
              disabled={status !== "playing"}
              className="px-7 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
