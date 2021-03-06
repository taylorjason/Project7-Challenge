const express = require('express');
const bodyparser = require('body-parser');
const { reset } = require('nodemon');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

let students = [];
students.push({
  id: 2,
  username: 'jDizzle',
  email: 'jDizzle@InTheHouse.co',
  name: ['Jason', 'Taylor'],
  grades: ['D', 'F']
});
students.push({
  id: 1,
  username: 'jDizzle',
  email: 'jDizzle@InTheHouse.co',
  name: ['Jason', 'Taylor'],
  grades: ['A', 'B']
});

app.use(bodyparser.json());
app.use(cookieParser());

app.get('/login', (req, res) => {
  let opts = { httpOnly: true };
  res.cookie('name', req.body.name);
  res.end();
});

app.get('/hello', (req, res) => {
  if (req.cookies.name) {
    res.send(`Welcome ${req.cookies.name}!`);
  } else {
    res.send('you must login!');
  }
});

app.get('/students', (req, res) => {
  let opts = { httpOnly: true };
  res.cookie('testing_key', 'testing_value');
  res.send(JSON.stringify(students));
  res.end();
});

app.get('/students/:id', (req, res) => {
  res.send(students.filter((stud) => stud.id === parseInt(req.params.id)));
});

app.get('/grades/:studentId', (req, res) => {
  res.send(
    students.filter((stud) => stud.id === parseInt(req.params.studentId))[0]
      .grades
  );
});

app.post('/grades/', (req, res) => {
  // students.find((stud) => stud.id)
  let id = req.body.id;
  let grade = req.body.grade;
  if (id && grade) {
    students[
      students.indexOf(students.find((stud) => stud.id === 1))
    ].grades.push(grade);
    res.send('grade submitted');
  } else {
    res.send('data should be json with id and grade property');
  }
});

app.post('/register', (req, res) => {
  if (req.body.email && req.body.username) {
    students.push(req.body);
    students[students.length - 1].id = students.length;
    console.log(students.slice[-1]);
    res.send(students);
  } else {
    res.send('must submit username and email');
  }
});
app.listen(port, () => console.log('listening on port 3000'));
