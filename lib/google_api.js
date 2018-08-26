require('dotenv').config();

const categoriesList= require('./categories');
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

const categories = categoriesList.categories;

// Dummy text imitating user input for testing
// const text = ''

let suggestedCategories = [];
let confirmedCategory = [];

// Modified Google API function: returns a one of five categories: 'To Eat', 'To Watch', 'To Read', 'To Buy', 'null'
function suggestCategory(text) {
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
    // console.log(suggestedCategories);
    return suggestedCategories;
  })
  .then(suggestedCategories => {
    // console.log(suggestedCategories);
    if (suggestedCategories.length > 0) {
      suggestedCategories.forEach((suggestedCategory) => {
        for (let property in categories) {
          categories[property].forEach((category) => {
            if (suggestedCategory === category) {
              if (confirmedCategory.length < 1) {
                confirmedCategory.push(property);
              }
              // console.log(confirmedCategory);
            };
          });
        };
      });
      if (confirmedCategory.length === 0) {
        console.log('no suggested categories match todo categories');
        return null;
      } else {
        console.log(confirmedCategory[0]);
        return confirmedCategory[0];
      }
    } else {
      console.log("no suggestions!");
      return null;
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}
// suggestCategory(text);

/*************************************************/
/*************************************************/

// Returns one of five categories: 'To Read', 'To Eat', 'To Watch', 'To Buy', 'null', by matching suggested categories array with categories object.
// function confirmCategory(suggestedCategories) {
//   if (suggestedCategories.length > 0) {
//     suggestedCategories.forEach((suggestedCategory) => {
//       for (let property in categories) {
//         categories[property].forEach((category) => {
//           if (suggestedCategory === category) {
//             if (confirmedCategory.length < 1) {
//               confirmedCategory.push(property);
//             }
//           };
//         });
//       };
//     });
//     if (confirmedCategory.length === 0) {
//       return null;
//     } else {
//       return confirmedCategory;
//     }
//   } else {
//     return null;
//   }
// }
// console.log(confirmCategory(suggestedCategories));

module.exports.suggestCategory = suggestCategory;
// module.exports.confirmCategory = confirmCategory;
