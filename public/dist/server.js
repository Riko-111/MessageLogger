"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
function createDatabase() {
    const db = new sqlite3_1.default.Database("./database.db", sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE, (err) => {
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
}
app.get("/newDB", async (req, res) => {
    await deleteDatabase().then(() => { createDatabase(); });
});
async function deleteDatabase() {
    const db = await (0, sqlite_1.open)({
        filename: './database.db',
        driver: sqlite3_1.default.Database
    });
    await db.run("DROP TABLE IF EXISTS messages");
    await db.close();
}
app.get("/delete", async (req, res) => {
    await deleteDatabase();
    res.send("Database deleted");
});
const appPath = path_1.default.join(__dirname, "..");
console.log(appPath);
app.use(express_1.default.static(appPath));
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../", "index.html"))
// })
// tu przypadek obsłużenia dodawania za pomocą query parameter of HTTP get request
app.get("/send", async (req, res) => {
    const content = req.query;
    const db = await (0, sqlite_1.open)({
        filename: './database.db',
        driver: sqlite3_1.default.Database
    });
    const result = await db.run("INSERT INTO messages (content) VALUES (?)", [content.message]);
    console.log(content);
    console.log(result);
    res.send("Message received: " + content.message);
});
// TODO(Riko): Handle POST Requests with message contents
app.get("/createTable", (req, res) => {
    createDatabase();
    res.send("Table created");
});
app.get("/messages", async (req, res) => {
    const db = await (0, sqlite_1.open)({
        filename: './database.db',
        driver: sqlite3_1.default.Database
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