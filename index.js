const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

// ------ global middlewares
function logCountRequests(req, res, next) {
  console.count(`number of requests`);
  next();
}
server.use(logCountRequests);


// ------ local middlewares
// if the id of the project doesn't exist in array, return an error message;
function checkProjectInArray(req, res, next) {
  const { id } = req.params;

  const project = projects.find(element => element.id == id);

  if (!project) return res.status(400).json({ error: "Project doesn't exist 😟" });

  return next();
};

// ------ routes

// get all projects in array
server.get('/projects', (_, res) => res.json(projects));

// create a new project and push it to the array;
// body with { id, title }
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  let project = { id, title, 'tasks': [] };

  projects.push(project);
  res.json({ message: 'project added!! 😀' });
});

/*
  update a title of a project in array, using the middleware to validate if
  exists the id of the project in the array;
*/
server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(e => e.id == id);
  project.title = title;
  res.json(project);
});

/*
  delete a project, using the middleware to validate if
  exists the id of the project in the array;
*/
server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(e => e.id == id);
  projects.splice(projectIndex, 1);
  res.send();
});

/*
  adding a new task to the project object with the informed id, using the middleware to validate if
  exists the id of the project in the array;
*/
server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(e => e.id == id);
  project.tasks.push(title);
  res.json(project);
});

server.listen(3000);