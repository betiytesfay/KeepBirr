const express = require("express")
const cors = require("cors")
const pool = require("./data/db")
const app = express()
app.use(express.json())
app.use(cors())
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("Select Now()")
    res.send(`Time :${result.rows[0].now}`)
  }
  catch (err) {
    console.error(err);
    res.status(500).send("server error")
  }
})
app.listen(5000, () => {
  console.log("server is running on port 5000")
})