import express  from "express"
import sqlite3 from "sqlite3"
import {open} from "sqlite"
import path from "path"
import {Message} from "./types"
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
}

app.get("/newDB", async (req, res) => {
    await deleteDatabase().then(() => {createDatabase()})
})

async function deleteDatabase(): Promise<void> {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })
    await db.run("DROP TABLE IF EXISTS messages")
    await db.close()
}

app.get("/delete", async (req, res) => {
    await deleteDatabase()
    res.send("Database deleted")
})

const appPath = path.join(__dirname, "..")
console.log(appPath)
app.use(express.static(appPath))
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../", "index.html"))
// })

// tu przypadek obsłużenia dodawania za pomocą query parameter of HTTP get request
app.get("/send", async (req, res ) => {
    const content = req.query
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })
    const result = await db.run("INSERT INTO messages (content) VALUES (?)", [content.message])
    console.log(content)
    console.log(result)
    res.send("Message received: " + content.message)
})

// TODO(Riko): Handle POST Requests with message contents

app.get("/createTable", (req, res) => {
    createDatabase()
    res.send("Table created")
})

app.get("/messages", async (req, res) => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })
    const result: Message[] = await db.all("SELECT * FROM messages")
    console.log(result)
    await db.close()
    res.send(result)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})