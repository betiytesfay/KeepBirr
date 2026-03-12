const { Pool } = require("pg")
require("dotenv").config()
const pool = new Pool({
  user: process.env.DB_User,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});
pool.connect()
  .then(() => console.log("connected to database"))
  .catch((err) => console.error("Error connecting to database", err));

module.exports = pool;