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
    // alter:true so newly added columns/tables (e.g. WordList, wordListId) get applied to the existing sqlite file
    dbReadyPromise = sequelize.sync({ alter: true }).then(() => seedWords());
  }
  return dbReadyPromise as Promise<void>;
}