export const API_URL = "http://ec2-100-27-243-86.compute-1.amazonaws.com:4080";

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

// --- Dashboard / observability ---

export type HealthStatus = { status: "ok" | "error"; uptimeMs: number };

export type Stats = {
  wordListCount: number;
  activityConfigCounts: Record<string, number>;
  generationCounts: Record<string, number>;
  averageTimeOnPageMs: number;
  pageViewCounts: Record<string, number>;
  mostUsedActivityType: string | null;
  recentFailures: { id: number; activityType: string; errorReason: string | null; createdAt: string }[];
};

export function fetchHealth(): Promise<HealthStatus> {
  return fetch(`${API_URL}/api/health`).then((res) => res.json());
}

export function fetchStats(): Promise<Stats> {
  return fetch(`${API_URL}/api/stats`).then(unwrap);
}

export function logPageView(page: string, durationMs: number): void {
  fetch(`${API_URL}/api/events/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, durationMs }),
    keepalive: true,
  }).catch(() => {});
}

export function logGeneration(payload: { activityType: "wordle" | "wordsearch"; status: "success" | "failure"; errorReason?: string; durationMs?: number }): void {
  fetch(`${API_URL}/api/events/generation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export type ActivityConfigEntry = {
  id: number;
  name: string;
  activityType: "wordle" | "wordsearch";
  difficulty: "easy" | "medium" | "hard";
  hintsEnabled: boolean;
  outputSettings: Record<string, unknown> | null;
  wordListId: number;
  wordListName: string | null;
};

export function fetchActivityConfigs(): Promise<ActivityConfigEntry[]> {
  return fetch(`${API_URL}/api/activity-configs`).then(unwrap);
}

export function createActivityConfig(payload: {
  name: string;
  activityType: "wordle" | "wordsearch";
  wordListId: number;
  difficulty?: "easy" | "medium" | "hard";
  hintsEnabled?: boolean;
  outputSettings?: Record<string, unknown>;
}): Promise<{ id: number; name: string; activityType: string }> {
  return fetch(`${API_URL}/api/activity-configs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);
}

export function deleteActivityConfig(id: number): Promise<null> {
  return fetch(`${API_URL}/api/activity-configs/${id}`, { method: "DELETE" }).then(unwrap);
}

