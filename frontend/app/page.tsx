"use client";

import { useEffect, useState } from 'react';

const downloadFile = (path: string, filename: string) => {
  const a = document.createElement("a");
  a.href = path;
  a.download = filename;
  a.click();
};

export default function Home() {
  return (
    <div className="flex flex-col bg-[var(--page-bg)] text-[var(--page-text)]">
      <main className="flex-1 p-6 flex flex-col gap-4 max-w-4xl mx-auto w-full">
        {/* Project description */}
        <div className="border border-[var(--border)] rounded p-6 text-left text-[var(--muted-text)]">
          <p>Phonemes are all about the sounds, not the letters. So when you hear the word phoneme, think ‘sound.’ </p>
          <p> In English, we have approximately 44 phonemes. </p>
          <br/>
          <p>Phonemes are important to distinguishing one word from another. </p>
          <p>For example, the words “cat” and “rat” differ by just one phoneme – /k/ and /r/ – </p>
          <p>which makes them completely different words with different meanings.</p>
          <a href="https://literacylearn.com/about-phonemes-graphemes-morphemes/" target="_blank" 
          className="text-blue-400 underline hover:text-blue-300 transition-colors cursor-pointer">
            visit literacylearn.com to learn more</a> 
           <p> <br/> Another great resource is the Victorian Education Department </p>
          <a href="https://www.education.vic.gov.au/Documents/school/teachers/teachingresources/discipline/english/literacy/44SoundsofAusEnglish.pdf" 
           target="_blank" className="text-blue-400 underline hover:text-blue-300 transition-colors cursor-pointer"> 
           Victoria Education Department PDF</a>
        </div>

        {/* Game description rectangle */}
        <div className="border border-[var(--border)] rounded p-8 flex flex-col gap-4 text-[var(--page-text)]">
          <h2 className="text-lg font-semibold text-blue-400">About the Games</h2>
          <div className="flex gap-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold text-teal-400 mb-1">Phoneme Wordle</h3>
              <p className="text-[var(--muted-text)] text-sm leading-relaxed">
                Guess a hidden word using IPA phoneme tiles. Each guess reveals whether phonemes are in the correct position, 
                present but misplaced, or absent. You have up to 8 attempts.
              </p>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold text-teal-400 mb-1">Phoneme Word Search</h3>
              <p className="text-[var(--muted-text)] text-sm leading-relaxed">
                Find IPA phoneme words hidden in a grid. Words run left→right, top→bottom, bottom→top, or diagonally. 
                Select the phoneme length and number of words, then drag across the grid to find them all.
              </p>
            </div>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => downloadFile("/wordsearch.html", "wordsearch-game.html")}
            className="flex-1 py-3 text-sm font-semibold text-blue-400 border border-[var(--border)] rounded hover:bg-[var(--chrome-bg)] transition-colors"
          >
            ⬇ Download Word Search Game
          </button>
        </div>
      </main>
    </div>
  );
}
