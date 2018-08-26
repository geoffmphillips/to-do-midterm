require('dotenv').config();

const categoriesList= require('./categories');
const categories = categoriesList.categories;
// console.log(categories.categories);

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

/**
 * TODO(developer): Uncomment the following line to run this code.
 */
const text = 'asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ';

// Prepares a document, representing the provided text
const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

const suggestedCategories = [];

// Returns one of five categories: 'To Read', 'To Eat', 'To Watch', 'To Buy'
function categorize(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  client
    .classifyText({ document: document })
    .then(results => {
      const classification = results[0];

      classification.categories.forEach(category => {
        suggestedCategories.push(category.name);
      });
      return suggestedCategories;
    })
    .then((suggestedCategories) => {
      if (suggestedCategories.length > 0) {
        suggestedCategories.forEach((suggestedCategory) => {
          for (let property in categories) {
            let todoCategory = property
            categories[property].forEach((category) => {
              if (suggestedCategory === category) {
                // console.log(typeof todoCategory);
                // console.log(todoCategory);
                return todoCategory;
              };
            });
          };
        });
      } else {
        suggestedCategories = null;
        return suggestedCategories;
      };
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

categorize(text);

module.exports.categorize = categorize;
