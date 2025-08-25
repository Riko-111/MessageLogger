import express  from "express"
import sqlite3 from "sqlite3"
import {open} from "sqlite"
const app = express()
const PORT = process.env.PORT || 3000

function createDatabase(): void {
   const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
       if (err) {
           console.error("Error opening database:", err.message)
       } else {
           console.log("Database opened successfully")
           db.run(`CREATE TABLE IF NOT EXISTS messages (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               content TEXT NOT NULL
           )`, (err) => {
               if (err) {
                   console.error("Error creating table:", err.message)
               } else {
                   console.log("Table created or already exists")
               }
           })
       }
   })
    db.run("INSERT INTO messages (content) VALUES (?)", ["Hello, World!"], (err) => {})
}

type Message = {
    id: number
    content: string
}

app.post("/createTable", (req, res) => {
    createDatabase()
    res.send("Table created")
})

app.get("/", async (req, res) => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })
    const result: Message[] = await db.all("SELECT * FROM messages", [], (err: Error | null, rows: Message[]) => {
        if (err) {
            throw err
        }
        return rows
    })
    console.log(result)
    await db.close()
    res.send("Hello, World!")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})