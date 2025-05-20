import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
const port = 3000;

let db;

// Wrap database connection in an async function
async function initialize() {
  db = await mysql.createConnection({
    user: "khoa",
    host: "localhost",
    database: "travel_tracker",
    password: "123456",
    port: 3306,
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Khoa", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

// Update the checkVisisted function to use proper promise syntax
async function checkVisisted() {
  const [rows] = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
// Update the /add endpoint
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const [rows] = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE CONCAT('%', ?, '%')",
      [input.toLowerCase()]
    );
    console.log("rows", rows);
    if (rows.length === 0) {
      console.log("Country not found");
      return res.redirect("/");
    }
    // Check if the country is already visited
    const [visitedRows] = await db.query(
      "SELECT country_code FROM visited_countries WHERE country_code = ?",
      [rows[0].country_code]
    );
    if (visitedRows.length > 0) {
      console.log("Country already visited");
      return res.redirect("/");
    }
    // Insert the country into the visited_countries table
    // Use the first country code from the result
    // You can modify this logic if you want to handle multiple countries
    // or if you want to allow the user to select a specific country
    // from the list of results.
    // For now, we will just take the first result
    // and insert it into the visited_countries table.
  
    const countryCode = rows[0].country_code;
    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES (?)",
      [countryCode]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
app.post("/user", async (req, res) => {});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

// Call initialize function to start the server
initialize().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
