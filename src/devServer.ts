import express from "express";
import { getToonIdsFromPrefixMatch } from "./repositories/getToonIdsFromPrefixMatch";
import { getToonInfoFromToonId } from "./repositories/getToonInfoFromToonId";

const app = express();
const PORT = 3000;

app.use(express.json());

async function start() {
    console.log("Starting Toon Tracker backend...")
  
    // await updateAllToons()

    console.log(JSON.stringify(await getToonInfoFromToonId(46304643)))
    console.log(await getToonIdsFromPrefixMatch(''))
  
    // setInterval(async () => {
    //   console.log("Polling ToonHQ for new toons...")
    //   await updateAllToons()
    // }, 40 * 1000)
  
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  }
  
  start().catch((err) => {
    console.error("Error starting app:", err)
  })