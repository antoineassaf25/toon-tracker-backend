import express from "express";
import { updateAllToons } from './services/updateAllToons.js'

const app = express();
const PORT = 3000;

app.use(express.json());

async function start() {
    console.log("Starting Toon Tracker backend...")
  
    await updateAllToons()
  
    // Run every 60 seconds
    setInterval(async () => {
      console.log("Polling ToonHQ for new toons...")
      await updateAllToons()
    }, 60 * 1000)
  
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  }
  
  start().catch((err) => {
    console.error("Error starting app:", err)
  })