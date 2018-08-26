"use strict";

require('dotenv').config();

const PORT             = process.env.PORT || 8080;
const ENV              = process.env.ENV || "development";
const express          = require("express");
const bodyParser       = require("body-parser");
const app              = express();
const cookieParser     = require("cookie-parser")

const knexConfig       = require("./knexfile");
const knex             = require("knex")(knexConfig[ENV]);
const morgan           = require('morgan');
const knexLogger       = require('knex-logger');

const usersDataHelpers = require('./lib/users-data-helpers.js')(knex);
const todosDataHelpers = require('./lib/todos-data-helpers.js')(knex);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

/* ROUTES BELOW */

app.get("/", (req, res) => {
  if(!req.cookies.email){
    res.redirect("/login")
  } else {
    res.render("index");
  }
});

app.get("/todos", (req, res) => {
  if(req.cookies.email) {
    usersDataHelpers.getUserIdByEmail(req.cookies.email, (err, rows) => {
      if (err) {
        console.log(err);
      } else if (!rows) {
        res.redirect("/login");
      } else {
        const userId = rows.id;
        todosDataHelpers.getTodosByUserId(userId, (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.json(rows);
          }
        });
      }
  });
  } else {
    res.redirect("/login");
  }
});

app.post("/todos", (req, res) => {
  usersDataHelpers.getUserIdByEmail(req.cookies.email, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      let extendedTodo = todosDataHelpers.multiplyWords(req.body.todo);
      const todoObject = todosDataHelpers.createTodoObject(extendedTodo, rows.id, req.body.name);
      todosDataHelpers.saveTodo(todoObject, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    }
  });
});

app.post("/todos/:todoId/delete", (req, res) => {
  todosDataHelpers.deleteTodoById(req.params.todoId, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// Route to update a todo
app.post("/todos/:todoId/:category", (req, res) => {
  const todo = {
    id: req.params.todoId,
    category: req.params.category,
  }
  todosDataHelpers.updateTodoById(todo, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


app.get("/login", (req, res) => {
  res.render("login");
});

/* Post route for Login. Lets anyone log in, no checks. */
app.post("/login", (req, res) => {
  usersDataHelpers.getUserIdByEmail(req.body.email, (err, rows) => {
    if (err) {
      console.log(err);
    } else if (!rows) {
      res.render("login");
    } else {
      res.cookie("email", req.body.email);
      res.redirect('/');
    }
  });
});

// Route that gets the register page If user has a cookie, redirects to todos
app.get("/register", (req, res) => {
  if (req.cookies.email){
    res.redirect("/")
  }
  res.render("register")
});

app.post("/register", (req, res) => {
  usersDataHelpers.saveUser(req.body, function(err, rows) {
    if(err){
      console.log("error", err);
    } else {
      res.redirect('/login');
    }
  });
});

app.get("/users", (req, res) => {
  if(!req.cookies.email){
    res.redirect("/login")
  } else {
    usersDataHelpers.getUserByEmail(req.cookies.email, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.render('users', rows[0]);
      }
    });
  }
});

app.post("/users", (req, res) => {
  usersDataHelpers.updateUserByEmail(req.cookies.email, req.body, (err, rows) => {
    if (err) {
      console.log (err);
    } else {
      res.redirect('/users');
    }
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("email")
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
