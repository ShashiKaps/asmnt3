module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/words/route.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$sequelize$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/sequelize.tsx [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$cors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/cors.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$sequelize$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$sequelize$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 204,
        headers: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$cors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["corsHeaders"]
    });
}
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$sequelize$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureDb"])();
        const lengthParam = request.nextUrl.searchParams.get('length');
        const where = lengthParam ? {
            length: parseInt(lengthParam)
        } : undefined;
        const words = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$sequelize$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Word"].findAll(where ? {
            where
        } : undefined);
        const payload = words.map((w)=>({
                id: w.id,
                word: w.word,
                phonemes: JSON.parse(w.phonemes),
                wordListId: w.wordListId
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(payload, {
            headers: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$cors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["corsHeaders"]
        });
    } catch (error) {
        console.error(error);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]('Server error', {
            status: 500,
            headers: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$cors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["corsHeaders"]
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/lib/cors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "corsHeaders",
    ()=>corsHeaders
]);
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
}),
"[project]/app/lib/sequelize.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "User",
    ()=>User,
    "Word",
    ()=>Word,
    "WordList",
    ()=>WordList,
    "ensureDb",
    ()=>ensureDb,
    "sequelize",
    ()=>sequelize
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sequelize__$5b$external$5d$__$28$sequelize$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sequelize$29$__ = __turbopack_context__.i("[externals]/sequelize [external] (sequelize, esm_import, [project]/node_modules/sequelize)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__ = __turbopack_context__.i("[externals]/sqlite3 [external] (sqlite3, cjs, [project]/node_modules/sqlite3)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sequelize__$5b$external$5d$__$28$sequelize$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sequelize$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sequelize__$5b$external$5d$__$28$sequelize$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sequelize$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const SequelizeRuntime = __TURBOPACK__imported__module__$5b$externals$5d2f$sequelize__$5b$external$5d$__$28$sequelize$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sequelize$29$__["default"];
const DataTypes = SequelizeRuntime.DataTypes;
const sequelize = new SequelizeRuntime({
    dialect: 'sqlite',
    dialectModule: __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__["default"],
    storage: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'sqlite/dev.sqlite'),
    logging: false
});
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lineStatus: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    underscored: false
});
const Word = sequelize.define('Word', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // phonemes stored as a JSON-encoded array of strings, e.g. ["b","e","d"]
    phonemes: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    length: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: false
});
const WordList = sequelize.define('WordList', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phonemeLength: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: false
});
WordList.hasMany(Word, {
    foreignKey: 'wordListId',
    onDelete: 'CASCADE'
});
Word.belongsTo(WordList, {
    foreignKey: 'wordListId'
});
// Creates tables that don't exist yet (safe to call on every boot; no-ops once tables exist).
let dbReadyPromise = null;
async function seedWords() {
    const count = await WordList.count();
    if (count > 0) return;
    const dataDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'data');
    const files = [
        {
            file: 'words3.json',
            length: 3,
            name: 'Default 3-Phoneme Words'
        },
        {
            file: 'words4.json',
            length: 4,
            name: 'Default 4-Phoneme Words'
        },
        {
            file: 'words5.json',
            length: 5,
            name: 'Default 5-Phoneme Words'
        }
    ];
    for (const { file, length, name } of files){
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dataDir, file);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)) continue;
        const entries = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf-8'));
        if (entries.length === 0) continue;
        const wordList = await WordList.create({
            name,
            description: `Seeded default word list for ${length}-phoneme words`,
            phonemeLength: length
        });
        const rows = entries.map((entry)=>({
                word: entry.word,
                phonemes: JSON.stringify(entry.phonemes),
                length,
                wordListId: wordList.id
            }));
        await Word.bulkCreate(rows);
    }
}
function ensureDb() {
    if (!dbReadyPromise) {
        // alter:true so newly added columns/tables (e.g. WordList, wordListId) get applied to the existing sqlite file
        dbReadyPromise = sequelize.sync({
            alter: true
        }).then(()=>seedWords());
    }
    return dbReadyPromise;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1nj0lfx._.js.map