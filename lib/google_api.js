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
const text = 'books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books books ';

// Prepares a document, representing the provided text
const document = {
  content: text,
  type: 'PLAIN_TEXT',
};

const suggestedCategories = [];
let confirmedCategory;

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
      suggestedCategories.forEach((suggestedCategory) => {
        for (let category in categories) {
          categories[category].forEach((category) => {
            if (suggestedCategory === category) {
              confirmedCategory = category;
              return confirmedCategory;
            };
          });
        };
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

// categorize(text);

module.exports.categorize = categorize;
