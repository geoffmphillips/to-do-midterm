# todo

Smart todo list that automatically categorizes your todos. The Google Natural Language API is used to produce the category. This project uses jQuery, Bootstrap, Express, EJS, Knex/PostgreSQL, Bootstrap, Sass.

## Final Product

![Home page](https://github.com/da-morgan/to-do-midterm/blob/master/img/todos.png)

Home page with all tasks. The category of the todos can be changed via a dropdown menu. The todos can also be deleted. Any task that is uncategorized will be put into the generic "To Do" list.

![Mobile version](https://github.com/da-morgan/to-do-midterm/blob/master/img/mobile.png)

The responsive design allows for the web app to be used as a mobile web app.

## Getting Started

NOTE: Google Cloud API credentials are needed to use the categorization functionality of the app. The credentials must be downloaded as a JSON file. A .env file with a reference to the JSON file is needed as well ```GOOGLE_APPLICATION_CREDENTIALS="relative_path_to_file.json"```

1. Clone this repo!
2. Install dependencies with ```npm i```
3. (OPTIONAL) Set up Google credentials as mentioned above.

## Dependencies

* Google Natural Language API
* Assert-plu
* Body-parser
* Cookie-parser
* Dotenv
* EJS
* Express
* Knex
* Knex-logger
* Lodash
* Morgan
* Pg
* Sass
