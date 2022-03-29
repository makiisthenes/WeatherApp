/* Node JS API Server Script */
/* Using Express v4 */

/* global db */
/* eslint no-restricted-globals: "off" */

// Imports
require('dotenv').config({ path: 'process.env' });
const express = require('express'); // Imports the express module to this script.
const { installHandler } = require('./js_modules/api_handler.js');
const { connectToDb } = require('./js_modules/db.js');


// Instantates a server application.
const app = express();

// Using Apollo Graphql Handler Middleware
installHandler(app)

// Async function to start db and run server.
const API_PORT = process.env.API_PORT || 3000;

(async () => {
  try {
    await connectToDb();
    app.listen(API_PORT, () => console.log(`🚀 API Server has started on port [${String(process.env.API_PORT)}] \nTo access open http://localhost:3000/graphql on browser.`));
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
// End