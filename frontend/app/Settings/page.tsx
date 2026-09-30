"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../Components/ThemeProvider";
import { fetchAllWordLists, WordEntry } from "../lib/api";
import ActivityManager from "../Components/ActivityManager";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const wordsByLengthRef = useRef<Record<3 | 4 | 5, WordEntry[]>>({ 3: [], 4: [], 5: [] });
  const [loadError, setLoadError] = useState("");
  const [wordList, setWordList] = useState("");
  const [phonemeLength, setPhonemeLength] = useState<3 | 4 | 5>(3);
  const [downloadLen, setDownloadLen] = useState<3 | 4 | 5 | "all">(3);

  const toWordListText = (len: 3 | 4 | 5) =>
    wordsByLengthRef.current[len].map((e) => `${e.word}  [${e.phonemes.join(" ")}]`).join("\n");

  const toDownloadText = (len: 3 | 4 | 5 | "all") => {
    if (len === "all") {
      return [
        "── 3-Phoneme Words ──",
        toWordListText(3),
        "",
        "── 4-Phoneme Words ──",
        toWordListText(4),
        "",
        "── 5-Phoneme Words ──",
        toWordListText(5),
      ].join("\n");
    }
    return toWordListText(len);
  };

  useEffect(() => {
    fetchAllWordLists()
      .then((lists) => {
        wordsByLengthRef.current = lists;
        setWordList(toWordListText(3));
      })
      .catch(() => setLoadError("Could not load word list from the API."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhonemeLengthChange = (len: 3 | 4 | 5) => {
    setPhonemeLength(len);
    setWordList(toWordListText(len));
  };

  const handleDownload = () => {
    const text = toDownloadText(downloadLen);
    const filename = downloadLen === "all" ? "phoneme-words-all.txt" : `phoneme-words-${downloadLen}.txt`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[var(--page-bg)] text-[var(--page-text)] p-8">
      {loadError && <p className="text-center text-red-400 text-sm mb-4">{loadError}</p>}
      <div className="max-w-6xl mx-auto flex gap-10"> {/* width change - max-w-5xl change the number*/}
        {/* Left column */}
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex gap-8">
            {/* Light Mode */}
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <span className="text-sm text-[var(--muted-text)]">Light Mode</span>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="w-6 h-6 accent-teal-400 cursor-pointer"
              />
            </label>

            {/* Dark Mode */}
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <span className="text-sm text-[var(--muted-text)]">Dark Mode</span>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="w-6 h-6 accent-teal-400 cursor-pointer"
              />
            </label>
          </div>

          <ActivityManager />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Phoneme length selector */}
          <div className="flex items-center gap-4">
            <span className="shrink-0">Phoneme Length</span>
            <div className="flex gap-6">
              {([3, 4, 5] as const).map((len) => (
                <label key={len} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="phonemeLength"
                    checked={phonemeLength === len}
                    onChange={() => handlePhonemeLengthChange(len)}
                    className="w-6 h-6 accent-teal-400 cursor-pointer"
                  />
                  <span className="text-sm">{len}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 flex-1">
            <span className="shrink-0">Word List</span>
            <textarea
              value={wordList}
              onChange={(e) => setWordList(e.target.value)}
              className="flex-1 border border-[var(--border)] rounded p-3 bg-[var(--wordlist-bg)] text-[var(--page-text)] font-mono text-sm resize-none outline-none focus:border-blue-400 min-h-[580px]"
            />
          </div>

          {/* Download word list */}
          <div className="flex flex-col gap-3 border border-[var(--border)] rounded p-4">
            <span className="font-semibold text-sm">Download Phoneme Word List</span>
            <div className="flex gap-4 flex-wrap">
              {([3, 4, 5, "all"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="downloadLen"
                    checked={downloadLen === opt}
                    onChange={() => setDownloadLen(opt)}
                    className="w-5 h-5 accent-teal-400 cursor-pointer"
                  />
                  <span className="text-sm">{opt === "all" ? "All" : opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleDownload}
              className="mt-1 py-2 px-4 border border-[var(--border)] rounded text-sm font-semibold hover:bg-[var(--chrome-bg)] transition-colors text-blue-400"
            >
              ⬇ Download .txt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
