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

// Mount all resource routes
// app.use("/api/users", usersRoutes(knex));

/* ROUTES BELOW */

// Get the Todos page.
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

/* Route for when a user posts a new todo.*/
app.post("/todos", (req, res) => {

  function idFinder(email) {
    knex.select("id").from("users").where({email: `${email}`})
     .then((rows) => { return rows[0].id; })
     .then((id) => {
       console.log(id);
        knex('todos').insert(
          {name: req.body.todo,
          is_complete: false,
          user_id: id,
          category: "To Watch"
        }).catch((err) => {
          console.log("error", err);
        })
        .asCallback(function(err, rows){
          if(err){
            console.log("error", err)
          } else {
            console.log("post added successfully")
            res.redirect("/");
          }
        });
      });
  }
});

/* Route to update a todo */
app.put("/todos/todoId", (req, res) => {
  //SQL query to update entire todo record.
  knex('todos').where(`id = ${req.body.todoId}`)
    .update({
    id: req.body.todoId,
    name: req.body.name,
    is_complete: req.body.isComplete,
    user_id: req.session.email
  });

  res.redirect("/");
});

/* Deletes a todo item from the DB.
   Redirects the user to todos page */
app.delete("/todos/todoId", (req, res) => {
  knex('todos').where(`id: ${req.body.todoId}`).del();

  res.redirect("/");
});

/* GET route for login page. Redirects to URLS
   if the user is already logged in */
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
        console.log("user not recognized");
        res.redirect("/register");
      } else if (!rows[0]) {
        console.log("user not recognized");
        res.redirect('/register');
      } else  {
        console.log("user recognized");
        res.cookie("email", userEmail);
        res.redirect('/');
      }
    });
  }
  emailChecker(userEmail);
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
