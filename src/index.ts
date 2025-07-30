import express from "express";
import { updateAllToons } from './services/updateAllToons.ts'

const app = express();
const PORT = 3000;

app.use(express.json());

async function start() {
    console.log("Starting Toon Tracker backend...")
  
    await updateAllToons()
  
    setInterval(async () => {
      console.log("Polling ToonHQ for new toons...")
      await updateAllToons()
    }, 40 * 1000)
  
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  }
  
  start().catch((err) => {
    console.error("Error starting app:", err)
  })