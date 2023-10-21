const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
app.get("/movies", async (request, response) => {
  const data = `select movie_name as movieName from movie`;
  const data_query = await db.all(data);
  response.send(data_query);
});

app.post("/movies/", async (request, response) => {
  const details = request.body;
  const { directorId, movieName, leadActor } = details;
  const database = `insert into movie(director_id,movie_name,lead_actor) values('${directorId}','${movieName}','${leadActor}');`;
  const data = await db.run(database);
  const bookId = data.lastID;
  response.send("Movie Successfully Added");
});
/*third*/
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const data = `select * from movie where movie_id=${movieId};`;
  const gettingdata = await db.get(data);
  response.send(gettingdata);
});
/*four*/
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const data = `update movie set director_id='${directorId}',movie_name='${movieName}',lead_actor='${leadActor}' where movie_id=${movieId};`;
  const settingdata = await db.run(data);
  response.send("Movie Details Updated");
});
/*five*/
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleting = `Delete from movie where movie_id='${movieId}';`;
  await db.run(deleting);
  response.send("Book Deleted Successfully");
});
/*six*/
app.get("/directors/", async (request, response) => {
  const data = `select director_id as directorId,director_name as directorName from director;`;
  const gettingdata = await db.all(data);
  response.send(gettingdata);
});
/*seven*/
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const data = `select movie_name as movieName from movie where director_id='${directorId}';`;
  const workingondatabase = await db.all(data);
  response.send(workingondatabase);
});

module.exports = app;
