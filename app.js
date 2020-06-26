const express = require('express');
const bodyparser = require('body-parser');
const { reset } = require('nodemon');
const cookieParser = require('cookie-parser');
const Pool = require('pg').Pool;
const connection = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'students',
  password: 'dev-password',
  port: 5432
});
const app = express();
const port = 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/students', (req, res) => {
  let search = req.query.search ? `%${req.query.search}%` : '%';
  connection.query(
    'SELECT * FROM students WHERE first_name LIKE $1',
    [search],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.send(JSON.stringify(results.rows));
    }
  );
});

app.get('/students/:id', (req, res) => {
  connection.query(
    'SELECT * FROM students WHERE id = $1',
    [req.params.id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.send(JSON.stringify(results.rows));
    }
  );
});

app.get('/grades/:studentId', (req, res) => {
  connection.query(
    'SELECT grade FROM grades WHERE student_id = $1',
    [req.params.studentId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.send(JSON.stringify(results.rows.map((grade) => grade.grade)));
    }
  );
});

app.post('/grades/', (req, res) => {
  // students.find((stud) => stud.id)
  let id = req.body.id;
  let grade = req.body.grade;
  if (id && grade) {
    // students[
    //   students.indexOf(students.find((stud) => stud.id === 1))
    // ].grades.push(grade);
    // res.send('grade submitted');
    connection.query(
      'INSERT INTO grades (grade, student_id) VALUES ($1, $2) RETURNING *',
      [grade, id],
      (error, results) => {
        if (error) {
          if (
            error.message.includes(
              'violates foreign key constraint "grades_student_id_fkey"'
            )
          ) {
            res.send(`No student exists with id: ${id}`);
            res.end();
          } else {
            res.send(error.message);
            res.end();
          }
        } else {
          res.send(JSON.stringify(results.rows));
        }
      }
    );
  } else {
    res.send('data should be json with id and grade property');
  }
});

app.post('/register', (req, res) => {
  if (
    req.body.email &&
    req.body.username &&
    req.body.first_name &&
    req.body.last_name
  ) {
    connection.query(
      'INSERT INTO students (first_name, last_name, username, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.email
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.send(JSON.stringify(results.rows));
      }
    );
  } else {
    res.send('must submit username and email');
  }
});
app.listen(port, () => console.log('listening on port 3000'));
