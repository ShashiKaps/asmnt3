export const API_URL = "http://ec2-18-232-124-196.compute-1.amazonaws.com:4080";

export type WordEntry = {
  id?: number;
  word: string;
  phonemes: string[];
  wordListId?: number;
};

export type WordListEntry = {
  id: number;
  name: string;
  description: string | null;
  phonemeLength: 3 | 4 | 5;
  words: WordEntry[];
};

export async function fetchWords(length?: 3 | 4 | 5): Promise<WordEntry[]> {
  const url = length ? `${API_URL}/api/words?length=${length}` : `${API_URL}/api/words`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch words (${res.status})`);
  const words: WordEntry[] = await res.json();
  return words.sort((a, b) => a.word.localeCompare(b.word));
}

export async function fetchAllWordLists(): Promise<Record<3 | 4 | 5, WordEntry[]>> {
  const [three, four, five] = await Promise.all([fetchWords(3), fetchWords(4), fetchWords(5)]);
  return { 3: three, 4: four, 5: five };
}

// --- Activity configuration (word list) CRUD ---

async function unwrap(res: Response) {
  if (!res.ok) throw new Error((await res.text()) || `Request failed (${res.status})`);
  if (res.status === 204) return null;
  return res.json();
}

export function fetchWordLists(): Promise<WordListEntry[]> {
  return fetch(`${API_URL}/api/wordlists`)
    .then(unwrap)
    .then((lists: WordListEntry[]) =>
      lists.map((l) => ({ ...l, words: [...l.words].sort((a, b) => a.word.localeCompare(b.word)) }))
    );
}

export function createWordList(payload: { name: string; description?: string; phonemeLength: 3 | 4 | 5 }): Promise<WordListEntry> {
  return fetch(`${API_URL}/api/wordlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);
}

export function updateWordList(id: number, payload: { name?: string; description?: string; phonemeLength?: 3 | 4 | 5 }): Promise<WordListEntry> {
  return fetch(`${API_URL}/api/wordlists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);
}

export function deleteWordList(id: number): Promise<null> {
  return fetch(`${API_URL}/api/wordlists/${id}`, { method: "DELETE" }).then(unwrap);
}

export function addWordToList(listId: number, payload: { word: string; phonemes: string[] }): Promise<WordEntry> {
  return fetch(`${API_URL}/api/wordlists/${listId}/words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);
}

export function updateWord(id: number, payload: { word?: string; phonemes?: string[] }): Promise<WordEntry> {
  return fetch(`${API_URL}/api/words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);
}

export function deleteWord(id: number): Promise<null> {
  return fetch(`${API_URL}/api/words/${id}`, { method: "DELETE" }).then(unwrap);
}

