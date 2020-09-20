const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging to the console the port that the server is running at
// Begins listening for requests
app.listen(PORT, () => {
  console.log("Running at http://localhost:" + PORT);
});

// GET requests that load the proper html pages
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// API requests that deal with the retrieving and sending of note data
app.get("/api/notes", (req, res) => {
  return res.json(JSON.parse(fs.readFileSync("./db/db.json")));
});
app.post("/api/notes", (req, res) => {
  // Retrieves Data
  const data = JSON.parse(fs.readFileSync("./db/db.json"));

  // Assigns ID based on number of milliseconds since UNIX
  const now = new Date();
  req.body.id = Math.round(now.getTime());

  // Updates the database and returns the new data
  data.push(req.body);
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(data, null, 4),
    (err) => {
      if (err) throw err;
      console.log("Data has been successfully saved");
    }
  );
  return res.send(data);
});

// API request that deletes an existing note
app.delete("/api/notes/:id", (req, res) => {
  // Retrieves ID
  let ID = req.params.id;
  // Retrieves Data
  let data = JSON.parse(fs.readFileSync("./db/db.json"));
  // Finds the index of the note to be deleted in the database
  let dbIndex = data.map((item) => item.id).indexOf(ID);
  data.splice(dbIndex, 1);
  fs.writeFile("./db/db.json", JSON.stringify(data, null, 4));
  return res.send(data);
});
