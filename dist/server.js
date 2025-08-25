"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3 = __importStar(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
function createDatabase() {
    const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error("Error opening database:", err.message);
        }
        else {
            console.log("Database opened successfully");
            db.run(`CREATE TABLE IF NOT EXISTS messages (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               content TEXT NOT NULL
           )`, (err) => {
                if (err) {
                    console.error("Error creating table:", err.message);
                }
                else {
                    console.log("Table created or already exists");
                }
            });
        }
    });
    db.run("INSERT INTO messages (content) VALUES (?)", ["Hello, World!"], (err) => { });
}
const appPath = path_1.default.join(__dirname, "..");
console.log(appPath);
app.use(express_1.default.static(appPath));
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../", "index.html"))
// })
// tu przypadek obsłużenia dodawania za pomocą query parameter of HTTP get request
app.get("/send", (req, res) => {
    const content = req.query;
    console.log(content);
    res.send("Message received: " + content.message);
});
// TODO(Riko): Handle POST Requests with message contents
app.post("/createTable", (req, res) => {
    createDatabase();
    res.send("Table created");
});
app.get("/messages", async (req, res) => {
    const db = await (0, sqlite_1.open)({
        filename: './database.db',
        driver: sqlite3.Database
    });
    const result = await db.all("SELECT * FROM messages");
    console.log(result);
    await db.close();
    res.send(result);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map