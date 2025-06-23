require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<p>phonebook has info for ${
      persons.length
    } people</p> <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "must provide name and number",
    });
  }

  const sameName = persons.find((person) => person.name === body.name);
  if (sameName) {
    return response.status(400).json({
      error: "must provide unique name",
    });
  }

  const person = {
    ...body,
    id: Math.floor(Math.random() * 1000000),
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
