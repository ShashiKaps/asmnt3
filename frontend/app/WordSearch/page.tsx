"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { fetchAllWordLists, WordEntry } from "../lib/api";

interface WordData {
  display: string;
  cleanDisplay: string;
  units: string[];
  found: boolean;
}

interface Solution {
  display: string;
  coords: { r: number; c: number }[];
}

interface Direction {
  dr: number;
  dc: number;
}

const DIRECTIONS: Direction[] = [
  { dr: 0, dc: 1 },  // left → right
  { dr: 1, dc: 0 },  // top → bottom
  { dr: 1, dc: 1 },  // diagonal ↘
];

const DEFAULT_WORDS = `tʃ ɪ n
b æɪ t
dʒ æ m
b æ d
b ʉː t
l ɔ ɡ
ɹ ɪ ŋ
f æ n
v æ n
s ɐ n`;

export default function WordSearchPage() {
  const [phonemeLength, setPhonemeLength] = useState<3 | 4 | 5 | "random">(3);
  const [numWords, setNumWords] = useState(10);
  const [wordInput, setWordInput] = useState(DEFAULT_WORDS);
  const [loadError, setLoadError] = useState("");
  const wordsByLengthRef = useRef<Record<3 | 4 | 5, WordEntry[]>>({ 3: [], 4: [], 5: [] });

  const toWordInput = (len: 3 | 4 | 5 | "random") => {
    const lists = wordsByLengthRef.current;
    if (len === "random") {
      const all = [...lists[3], ...lists[4], ...lists[5]];
      return all.sort(() => Math.random() - 0.5).map((e) => e.phonemes.join(" ")).join("\n");
    }
    return [...lists[len]].sort(() => Math.random() - 0.5).map((e) => e.phonemes.join(" ")).join("\n");
  };

  const handlePhonemeLengthChange = (len: 3 | 4 | 5 | "random") => {
    setPhonemeLength(len);
    const newInput = toWordInput(len);
    setWordInput(newInput);
    buildPuzzle(newInput);
  };
  const [gridRows, setGridRows] = useState(10);
  const [gridCols, setGridCols] = useState(10);
  const [gridMatrix, setGridMatrix] = useState<string[][]>([]);
  const [wordsData, setWordsData] = useState<WordData[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showSol, setShowSol] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [error, setError] = useState("");

  const isSelecting = useRef(false);
  const startCell = useRef<{ r: number; c: number } | null>(null);
  const lastCell = useRef<{ r: number; c: number } | null>(null);
  // stable refs so event listeners don't capture stale state
  const gridMatrixRef = useRef<string[][]>([]);
  const wordsDataRef = useRef<WordData[]>([]);
  const solutionsRef = useRef<Solution[]>([]);

  const key = (r: number, c: number) => `${r},${c}`;

  function canPlace(units: string[], r: number, c: number, d: Direction, matrix: string[][], rows: number, cols: number) {
    const endR = r + d.dr * (units.length - 1);
    const endC = c + d.dc * (units.length - 1);
    if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) return false;
    for (let i = 0; i < units.length; i++) {
      const cr = r + d.dr * i;
      const cc = c + d.dc * i;
      if (matrix[cr][cc] && matrix[cr][cc] !== units[i]) return false;
    }
    return true;
  }

  function buildPuzzle(inputOverride?: string, numWordsOverride?: number) {
    setError("");
    setFound(new Set());
    setFoundWords(new Set());
    setHighlighted(new Set());
    setShowSol(false);

    // reshuffle every time so Generate Puzzle gives a different random selection
    const freshInput = inputOverride ?? toWordInput(phonemeLength);
    if (!inputOverride) setWordInput(freshInput);

    const rows = gridRows;
    const cols = gridCols;
    const lines = freshInput.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0).slice(0, numWordsOverride ?? numWords);
    if (lines.length === 0) return;

    const words: WordData[] = [];
    const pool: string[] = [];

    lines.forEach((line) => {
      const parts = line.includes(" ") ? line.split(/\s+/) : line.split("");
      const display = parts.join("");
      words.push({ display, cleanDisplay: parts.join(" "), units: parts, found: false });
      parts.forEach((p) => { if (!pool.includes(p)) pool.push(p); });
    });

    if (pool.length === 0) pool.push(...["æ", "b", "d", "ɪ", "p", "s", "t"]);

    const matrix: string[][] = Array.from({ length: rows }, () => new Array(cols).fill(""));
    const sols: Solution[] = [];

    words.forEach((w) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 200) {
        attempts++;
        const d = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (canPlace(w.units, r, c, d, matrix, rows, cols)) {
          const coords: { r: number; c: number }[] = [];
          for (let i = 0; i < w.units.length; i++) {
            const cr = r + d.dr * i;
            const cc = c + d.dc * i;
            matrix[cr][cc] = w.units[i];
            coords.push({ r: cr, c: cc });
          }
          sols.push({ display: w.display, coords });
          placed = true;
        }
      }
      if (!placed) setError((e) => e + `Could not place "${w.cleanDisplay}" — try a bigger grid. `);
    });

    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (!matrix[r][c]) matrix[r][c] = pool[Math.floor(Math.random() * pool.length)];

    gridMatrixRef.current = matrix;
    wordsDataRef.current = words;
    solutionsRef.current = sols;
    setGridMatrix([...matrix]);
    setWordsData([...words]);
    setSolutions([...sols]);
  }

  // show congratulations popup when all words are found
  useEffect(() => {
    if (wordsData.length > 0 && foundWords.size === wordsData.length) {
      setShowCongrats(true);
      const t = setTimeout(() => setShowCongrats(false), 3000);
      return () => clearTimeout(t);
    }
  }, [foundWords, wordsData]);

  // Fetch word lists from the API, then build the first puzzle
  useEffect(() => {
    fetchAllWordLists()
      .then((lists) => {
        wordsByLengthRef.current = lists;
        const initialInput = toWordInput(phonemeLength);
        setWordInput(initialInput);
        buildPuzzle(initialInput);
      })
      .catch(() => setLoadError("Could not load word list from the API."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getPath(a: { r: number; c: number }, b: { r: number; c: number }) {
    const dr = b.r - a.r;
    const dc = b.c - a.c;
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;
      return Array.from({ length: steps + 1 }, (_, i) => ({ r: a.r + stepR * i, c: a.c + stepC * i }));
    }
    return null;
  }

  const handleMouseDown = useCallback((r: number, c: number) => {
    isSelecting.current = true;
    startCell.current = { r, c };
    lastCell.current = { r, c };
    setHighlighted(new Set([key(r, c)]));
  }, []);

  const handleMouseEnter = useCallback((r: number, c: number) => {
    if (!isSelecting.current || !startCell.current) return;
    lastCell.current = { r, c };
    const path = getPath(startCell.current, { r, c });
    setHighlighted(new Set(path ? path.map((p) => key(p.r, p.c)) : [key(r, c)]));
  }, []);

  const checkSelection = useCallback(() => {
    if (!startCell.current || !lastCell.current) return;
    const path = getPath(startCell.current, lastCell.current);
    if (!path) return;

    const matrix = gridMatrixRef.current;
    const words = wordsDataRef.current;

    const str1 = path.map((p) => matrix[p.r]?.[p.c] ?? "").join("");

    words.forEach((w) => {
      if (!w.found && w.display === str1) {
        w.found = true;
        setFound((prev) => new Set([...prev, ...path.map((p) => key(p.r, p.c))]));
        setFoundWords((prev) => new Set([...prev, w.display]));
      }
    });
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      if (!isSelecting.current) return;
      isSelecting.current = false;
      checkSelection();
      setHighlighted(new Set());
    };
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [checkSelection]);

  function getCellStyle(r: number, c: number): string {
    const k = key(r, c);
    if (found.has(k)) return "bg-green-800 text-green-200";
    if (highlighted.has(k)) return "bg-yellow-500 text-black";
    if (showSol && solutionsRef.current.some((s) => s.coords.some((co) => co.r === r && co.c === c)))
      return "bg-pink-800 text-pink-100";
    return "bg-[var(--card-bg)] text-[var(--page-text)] hover:bg-[var(--chrome-bg)]";
  }

  return (
    <div className="bg-[var(--page-bg)] text-[var(--page-text)] p-6 relative">
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[var(--card-bg)] border border-yellow-500 rounded-2xl px-10 py-8 flex flex-col items-center gap-3 shadow-2xl animate-bounce">
            <span className="text-5xl">🏆</span>
            <span className="text-2xl font-bold text-yellow-400">Congratulations!</span>
            <span className="text-[var(--muted-text)] text-sm">You found all the words!</span>
          </div>
        </div>
      )}
      <h1 className="text-center text-2xl font-bold text-blue-400 mb-6">Phoneme Word Search - press the mouse and drag over the letters</h1>
      {loadError && <p className="text-center text-red-400 text-sm mb-4">{loadError}</p>}

      <div className="flex gap-8 items-start justify-center mx-auto px-10 max-w-screen-2xl">
        {/* Far-left controls — adjust gap-8 above or w-48 to reposition */}
        <div className="flex flex-col gap-6 shrink-0 w-48">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-[var(--page-text)] font-semibold">Phoneme Length</span>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex flex-row gap-5">
                {([3, 4, 5] as const).map((len) => (
                  <label key={len} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="phonemeLength"
                      checked={phonemeLength === len}
                      onChange={() => handlePhonemeLengthChange(len)}
                      className="w-5 h-5 accent-teal-400 cursor-pointer"
                    />
                    <span className="text-sm text-[var(--page-text)]">{len}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="phonemeLength"
                  checked={phonemeLength === "random"}
                  onChange={() => handlePhonemeLengthChange("random")}
                  className="w-5 h-5 accent-teal-400 cursor-pointer"
                />
                <span className="text-sm text-[var(--page-text)]">Random</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-[var(--page-text)] font-semibold">Number of Words</span>
            <div className="flex flex-col gap-5 mt-1">
              {[[7, 8, 9, 10], [11, 12, 13, 14]].map((row, i) => (
                <div key={i} className="flex flex-row gap-4">
                  {row.map((n) => (
                    <label key={n} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="numWords"
                        checked={numWords === n}
                        onChange={() => { setNumWords(n); buildPuzzle(undefined, n); }}
                        className="w-5 h-5 accent-teal-400 cursor-pointer"
                      />
                      <span className="text-sm text-[var(--page-text)]">{n}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boxes — adjust gap-6 below to space them */}
        <div className="flex gap-6 items-start overflow-x-auto">
          {/* Left panel */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 w-72 flex flex-col gap-3 shrink-0">
            {error && <p className="text-red-400 text-sm bg-red-950 rounded p-2">{error}</p>}

            <label className="font-semibold text-sm text-[var(--page-text)]">Words (Space-separated phonemes):</label>
            <textarea
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              className="bg-[var(--page-bg)] border border-[var(--border)] rounded p-2 text-white font-mono text-sm resize-none h-44 outline-none focus:border-blue-400"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-sm text-[var(--page-text)]">Rows 10 - 14</label>
                <input
                  type="number"
                  min={10}
                  max={14}
                  value={gridRows}
                  onChange={(e) => setGridRows(Math.min(14, Math.max(10, parseInt(e.target.value) || 10)))}
                  className="w-full bg-[var(--page-bg)] border border-[var(--border)] rounded px-2 py-1 text-[var(--page-text)] outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="font-semibold text-sm text-[var(--page-text)]">Columns 10 - 14</label>
                <input
                  type="number"
                  min={10}
                  max={14}
                  value={gridCols}
                  onChange={(e) => setGridCols(Math.min(14, Math.max(10, parseInt(e.target.value) || 10)))}
                  className="w-full bg-[var(--page-bg)] border border-[var(--border)] rounded px-2 py-1 text-[var(--page-text)] outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <button
              onClick={() => buildPuzzle()}
              className="bg-blue-700 hover:bg-blue-600 transition-colors rounded py-2 font-semibold"
            >
              Generate Puzzle
            </button>
            <button
              onClick={() => setShowSol((s) => !s)}
              className="bg-slate-600 hover:bg-slate-500 transition-colors rounded py-2 font-semibold"
            >
              {showSol ? "Hide Answers" : "Show Answers"}
            </button>
          </div>

          {/* Right panel */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex flex-col items-center gap-4 w-fit">
            {gridMatrix.length > 0 && (
              <div
                className="grid gap-0.5 select-none"
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
              >
                {gridMatrix.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={key(r, c)}
                      data-row={r}
                      data-col={c}
                      onMouseDown={() => handleMouseDown(r, c)}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                      onTouchStart={() => handleMouseDown(r, c)}
                      className={`flex items-center justify-center font-bold text-base border border-[var(--border)] cursor-pointer w-11 h-11 rounded transition-colors ${getCellStyle(r, c)}`}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Word list */}
            <div className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
              <h3 className="font-semibold text-[var(--muted-text)] mb-2">Word List:</h3>
              <div className="flex flex-wrap gap-2">
                {wordsData.map((w) => (
                  <span
                    key={w.display}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      foundWords.has(w.display)
                        ? "line-through text-gray-500 bg-green-950"
                        : "bg-[var(--card-bg)] text-[var(--page-text)]"
                    }`}
                  >
                    {w.cleanDisplay}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
