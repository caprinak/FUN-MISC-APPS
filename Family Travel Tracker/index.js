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
      "SELECT country_code, country_name FROM countries WHERE LOWER(country_name) LIKE CONCAT('%', ?, '%')",
      [input.toLowerCase()]
    );

    if (rows.length === 0) {
      console.log("Country not found");
      return res.redirect("/");
    }

    if (rows.length === 1) {
      // If only one country found, proceed with existing logic
      const [visitedRows] = await db.query(
        "SELECT country_code FROM visited_countries WHERE country_code = ?",
        [rows[0].country_code]
      );
      if (visitedRows.length > 0) {
        console.log("Country already visited");
        return res.redirect("/");
      }

      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES (?)",
        [rows[0].country_code]
      );
      return res.redirect("/");
    }

    // If multiple countries found, show search results page
    res.render("search-results.ejs", {
      countries: rows,
      searchTerm: input,
    });
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
app.post("/select-country", async (req, res) => {
  const countryCode = req.body.countryCode;

  try {
    // Check if country is already visited
    const [visitedRows] = await db.query(
      "SELECT country_code FROM visited_countries WHERE country_code = ? AND user_id = ?",
      [countryCode, currentUserId]
    );

    if (visitedRows.length > 0) {
      console.log("Country already visited by this user");
      return res.redirect("/");
    }

    // Add the selected country to visited_countries
    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES (?, ?)",
      [countryCode, currentUserId]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Error adding selected country:", err);
    res.redirect("/");
  }
});

// Call initialize function to start the server
initialize().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
