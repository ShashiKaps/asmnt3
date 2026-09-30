"use client";

import { useState } from "react";
import { fetchWordLists, addWordToList, updateWord, deleteWord } from "../lib/api";

export default function ActivityManager() {
  const [phonemeWord, setPhonemeWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [status, setStatus] = useState("");

  const getPhonemes = () => phonemeWord.trim().split(/\s+/).filter(Boolean);

  const handleAddWord = async () => {
    setStatus("");
    const phonemes = getPhonemes();
    const word = englishWord.trim();
    if (!word || phonemes.length === 0) {
      setStatus("Enter both a Phoneme Word and an English Word.");
      return;
    }
    try {
      const lists = await fetchWordLists();
      const match = lists.find((l) => l.phonemeLength === phonemes.length);
      if (!match) {
        setStatus(`No word list for ${phonemes.length}-phoneme words yet.`);
        return;
      }
      await addWordToList(match.id, { word, phonemes });
      setPhonemeWord("");
      setEnglishWord("");
      setStatus(`Added "${word}" to "${match.name}".`);
    } catch (e: any) {
      setStatus(e.message || "Could not add word.");
    }
  };

  const handleUpdateWord = async () => {
    setStatus("");
    const phonemes = getPhonemes();
    const word = englishWord.trim();
    if (!word || phonemes.length === 0) {
      setStatus("Enter both a Phoneme Word and an English Word.");
      return;
    }
    try {
      const lists = await fetchWordLists();
      const existing = lists.flatMap((l) => l.words).find((w) => w.word.toLowerCase() === word.toLowerCase());
      if (!existing || existing.id == null) {
        setStatus(`No existing word "${word}" found to update.`);
        return;
      }
      await updateWord(existing.id, { word, phonemes });
      setPhonemeWord("");
      setEnglishWord("");
      setStatus(`Updated "${word}".`);
    } catch (e: any) {
      setStatus(e.message || "Could not update word.");
    }
  };

  const handleDeleteWord = async () => {
    setStatus("");
    const word = englishWord.trim();
    if (!word) {
      setStatus("Enter the English Word to delete.");
      return;
    }
    try {
      const lists = await fetchWordLists();
      const existing = lists.flatMap((l) => l.words).find((w) => w.word.toLowerCase() === word.toLowerCase());
      if (!existing || existing.id == null) {
        setStatus(`No existing word "${word}" found to delete.`);
        return;
      }
      await deleteWord(existing.id);
      setPhonemeWord("");
      setEnglishWord("");
      setStatus(`Deleted "${word}".`);
    } catch (e: any) {
      setStatus(e.message || "Could not delete word.");
    }
  };

  return (
    <div className="border border-[var(--border)] rounded p-4 flex flex-col gap-3">
      <span className="font-semibold text-sm">Phoneme Word Manager</span>

      <div className="flex items-center gap-4">
        <label className="w-32 text-right shrink-0 text-sm">Phoneme Word</label>
        <input
          type="text"
          value={phonemeWord}
          onChange={(e) => setPhonemeWord(e.target.value)}
          placeholder="e.g. b e d"
          className="flex-1 border border-[var(--border)] rounded px-3 py-2 bg-transparent text-[var(--page-text)] font-mono outline-none focus:border-blue-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-right shrink-0 text-sm">English Word</label>
        <input
          type="text"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          placeholder="e.g. bed"
          className="flex-1 border border-[var(--border)] rounded px-3 py-2 bg-transparent text-[var(--page-text)] outline-none focus:border-blue-400"
        />
      </div>

      {status && <p className="text-sm text-[var(--muted-text)]">{status}</p>}

      <div className="flex justify-center gap-3">
        <button
          onClick={handleAddWord}
          className="border border-[var(--border)] rounded px-6 py-2 text-sm font-semibold text-blue-400 hover:bg-[var(--chrome-bg)] transition-colors"
        >
          Add Word
        </button>
        <button
          onClick={handleUpdateWord}
          className="border border-[var(--border)] rounded px-6 py-2 text-sm font-semibold text-blue-400 hover:bg-[var(--chrome-bg)] transition-colors"
        >
          Update Word
        </button>
        <button
          onClick={handleDeleteWord}
          className="border border-[var(--border)] rounded px-6 py-2 text-sm font-semibold text-red-400 hover:bg-[var(--chrome-bg)] transition-colors"
        >
          Delete Word
        </button>
      </div>
    </div>
  );
}
