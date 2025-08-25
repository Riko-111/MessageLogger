import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
const app = express();
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
const appPath = path.join(__dirname, "..");
console.log(appPath);
app.use(express.static(appPath));
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
    const db = await open({
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