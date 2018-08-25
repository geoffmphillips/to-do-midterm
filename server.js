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

// const usersRoutes = require("./routes/users");

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
    usersDataHelpers.getUserByEmail(req.cookies.email, (err, rows) => {
      if (err) {
        console.log(err);
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
  usersDataHelpers.getUserByEmail(req.cookies.email, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      const todo = todosDataHelpers.createTodoObject(req.body.todo, rows.id)
      todosDataHelpers.saveTodo(todo, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    }
  });
});

app.post("/todos/:todoId", (req, res) => {
  todosDataHelpers.updateTodoById(req.params.todoId, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
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

app.get("/login", (req, res) => {
  res.render("login");
});

/* Post route for Login. Lets anyone log in, no checks. */
/* THIS FUNCTION WORKS BUT IT IS VERY BAD PLZ REFACTOR */
app.post("/login", (req, res) => {
  let userEmail = req.body.email;

  function emailChecker (email){
    knex.select("email").from("users").where({email: `${email}`})
    .asCallback(function(err, rows){
      if(err){
        console.log("error", err);
        res.redirect("/register");
      } else if (!rows[0]) {
        res.redirect('/register');
      } else  {
        res.cookie("email", email);
        res.redirect('/');
      }
    });
  }
  emailChecker(req.body.email);
});

/* Route that gets the register page
   If user has a cookie, redirects to todos*/
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
  }
  let templateVars;
    function getTemplateVars(email){
      knex.select().from('users').where({email: `${email}`})
      .asCallback(function(err, rows){
        if(err){
          console.log("error", err);
        } else {
          templateVars = rows[0];
          res.render('users', templateVars);
        }
      })
    }
  getTemplateVars(req.cookies.email)
});

app.post("/users", (req, res) => {

  function userUpdater (email, params) {
      knex('users').where({email: `${email}`})
        .update({
        avatar: params.avatar,
        name: params.name,
        password: params.password,
        favorite_food: params.favorite_food,
        description: params.description
      }).asCallback(function(err, rows){
        if(err){
          console.log("error", err);
        } else {
          console.log("Information updated");
          res.redirect('/users');
        }
      });
  }
  userUpdater(req.cookies.email, req.body)
});

app.post("/logout", (req, res) => {
  res.clearCookie("email")
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
