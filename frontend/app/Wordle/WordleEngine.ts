// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export type Phoneme = string;

export type WordEntry = {
  word: string;
  phonemes: Phoneme[];
};

export type EvaluationResult = {
  guess: Phoneme[];
  result: ("green" | "yellow" | "grey")[];
};

export type Puzzle = {
  solution: WordEntry;
  maxGuesses: number;
  showHints: boolean;
};

// ---------------------------------------------------------
// PUZZLE GENERATOR
// Word lists are supplied by the caller (fetched from the API).
// ---------------------------------------------------------

export function generatePuzzle(
  list: WordEntry[],
  maxGuesses: number,
  showHints: boolean
): Puzzle {
  const solution = list[Math.floor(Math.random() * list.length)];

  return {
    solution,
    maxGuesses,
    showHints,
  };
}

// ---------------------------------------------------------
// GUESS VALIDATION
// ---------------------------------------------------------

export function isValidGuess(
  guess: Phoneme[],
  phonemeLength: number,
  list: WordEntry[]
): boolean {
  if (guess.length !== phonemeLength) return false;
  if (!list) return false;
  return list.some((entry) =>
    entry.phonemes.join("") === guess.join("")
  );
}

// ---------------------------------------------------------
// WORDLE EVALUATION ALGORITHM (PHONEME VERSION)
// ---------------------------------------------------------

export function evaluateGuess(
  guess: Phoneme[],
  solution: Phoneme[]
): ("green" | "yellow" | "grey")[] {
  const result = Array(guess.length).fill("grey");
  const remaining: (Phoneme | null)[] = [...solution];

  // Pass 1: Greens
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = "green";
      remaining[i] = null;
    }
  }

  // Pass 2: Yellows
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "green") continue;

    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "yellow";
      remaining[idx] = null;
    }
  }

  return result;
}

// ---------------------------------------------------------
// KEYBOARD STATE UPDATER
// ---------------------------------------------------------

export type KeyboardState = Record<
  string,
  "green" | "yellow" | "grey" | null
>;

export function updateKeyboardState(
  keyboard: KeyboardState,
  guess: Phoneme[],
  evaluation: ("green" | "yellow" | "grey")[]
): KeyboardState {
  const updated = { ...keyboard };

  for (let i = 0; i < guess.length; i++) {
    const phoneme = guess[i];
    const result = evaluation[i];

    const current = updated[phoneme];

    if (result === "green") {
      updated[phoneme] = "green";
    } else if (result === "yellow") {
      if (current !== "green") updated[phoneme] = "yellow";
    } else if (result === "grey") {
      if (!current) updated[phoneme] = "grey";
    }
  }

  return updated;
}

// ---------------------------------------------------------
// GAME STATUS CHECKER
// ---------------------------------------------------------

export function checkGameStatus(
  guess: Phoneme[],
  solution: Phoneme[],
  guessCount: number,
  maxGuesses: number
): "playing" | "won" | "lost" {
  if (guess.join("") === solution.join("")) return "won";
  if (guessCount >= maxGuesses) return "lost";
  return "playing";
}
