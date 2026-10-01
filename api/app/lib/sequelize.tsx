import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sqlite3 from 'sqlite3';

const SequelizeRuntime = Sequelize as any;
const DataTypes = SequelizeRuntime.DataTypes;

export const sequelize = new SequelizeRuntime({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: path.resolve(process.cwd(), 'sqlite/dev.sqlite'),
  logging: false,
} as any);

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lineStatus: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

export const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // phonemes stored as a JSON-encoded array of strings, e.g. ["b","e","d"]
  phonemes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

// An activity configuration - a named, editable set of words (e.g. a Wordle/Word Search word list).
export const WordList = sequelize.define('WordList', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phonemeLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

WordList.hasMany(Word, { foreignKey: 'wordListId', onDelete: 'CASCADE' });
Word.belongsTo(WordList, { foreignKey: 'wordListId' });

// A builder-configured activity (Wordle or Word Search) backed by one word list.
export const ActivityConfig = sequelize.define('ActivityConfig', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activityType: {
    type: DataTypes.ENUM('wordle', 'wordsearch'),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    defaultValue: 'medium',
  },
  hintsEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // free-form JSON text, e.g. { "gridRows": 10, "gridCols": 10, "maxAttempts": 6 }
  outputSettings: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

WordList.hasMany(ActivityConfig, { foreignKey: 'wordListId', onDelete: 'CASCADE' });
ActivityConfig.belongsTo(WordList, { foreignKey: 'wordListId' });

// One row per generation attempt (builder preview or end-user play), for the dashboard's
// success/failure counters and most-used-activity-type reporting.
export const GenerationEvent = sequelize.define('GenerationEvent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  activityType: {
    type: DataTypes.ENUM('wordle', 'wordsearch'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('success', 'failure'),
    allowNull: false,
  },
  errorReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

// One row per page visit, for average-time-on-page reporting.
export const PageView = sequelize.define('PageView', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: false,
}) as any;

// Creates tables that don't exist yet (safe to call on every boot; no-ops once tables exist).
let dbReadyPromise: Promise<void> | null = null;

async function seedWords() {
  const count = await WordList.count();
  if (count > 0) return;

  const dataDir = path.resolve(process.cwd(), 'data');
  const files: { file: string; length: number; name: string }[] = [
    { file: 'words3.json', length: 3, name: 'Default 3-Phoneme Words' },
    { file: 'words4.json', length: 4, name: 'Default 4-Phoneme Words' },
    { file: 'words5.json', length: 5, name: 'Default 5-Phoneme Words' },
  ];

  for (const { file, length, name } of files) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) continue;
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as { word: string; phonemes: string[] }[];
    if (entries.length === 0) continue;

    const wordList = await WordList.create({
      name,
      description: `Seeded default word list for ${length}-phoneme words`,
      phonemeLength: length,
    });
    const rows = entries.map((entry) => ({
      word: entry.word,
      phonemes: JSON.stringify(entry.phonemes),
      length,
      wordListId: wordList.id,
    }));
    await Word.bulkCreate(rows);
  }
}

export function ensureDb(): Promise<void> {
  if (!dbReadyPromise) {
    // plain sync (no alter): alter:true recreates tables on every boot, and since Words.wordListId
    // has ON DELETE CASCADE, dropping/recreating WordLists wiped all Word rows on every restart.
    // Run migrations (see migrations/) for schema changes instead of altering on boot.
    dbReadyPromise = sequelize.sync().then(() => seedWords());
  }
  return dbReadyPromise as Promise<void>;
}