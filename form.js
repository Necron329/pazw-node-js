// Import the required modules
const express = require('express'); // Express framework for creating the server
const bodyParser = require('body-parser'); // Middleware for parsing form data (URL-encoded)
const path = require('path'); // Module for working with file and directory paths
const mysql = require('mysql2'); // MySQL client for Node.js to interact with a MySQL database

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost', // Host where the MySQL database is running (localhost for local dev)
    user: 'admin', // MySQL username
    password: 'my_password', // MySQL user password
    database: 'test' // Database name
});

// Create an instance of the Express app
const app = express();
const port = 3000; // Define the port where the server will run

// Middleware to parse URL-encoded form data from POST requests
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Route to serve the `index.html` file when a user accesses the root URL (`/`).
 * The file is located in the same directory as this server file.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Sends the HTML file as the response
});

/**
 * Route to handle the form submission.
 * When the form is submitted via POST to `/submit`, this route is triggered.
 */
app.post('/submit', (req, res) => {
    // Destructure form fields from the request body
    const { name, lname } = req.body;

    // SQL query to insert the form data into the `names` table
    // This could be vulnerable to SQL injection; prepared statements are recommended (shown in a comment below)
    const insertValuesQuery = `
        INSERT INTO names (name, last_name) VALUES ('${name}', '${lname}')
    `;

    // Execute the SQL query to insert the data into the database
    connection.query(insertValuesQuery, (err, results) => {
        // Error handling: if there's an error, log it and don't proceed
        if (err) {
            console.error('Error inserting values:', err);
            return res.status(500).send('Error inserting data into the database');
        }

        // Log the number of rows affected (should be 1 for successful insert)
        console.log('Values inserted:', results.affectedRows);

        // Send a success response back to the client (could be a redirect to a thank-you page)
        res.send('Form submitted successfully!');
    });

    /**
     * Note: The use of string interpolation to build the SQL query like this:
     * ('${name}', '${lname}') is vulnerable to SQL injection.
     * A more secure way is to use prepared statements, like this:
     * 
     * const insertValuesQuery = 'INSERT INTO names (name, last_name) VALUES (?, ?)';
     * connection.query(insertValuesQuery, [name, lname], (err, results) => {...});
     * 
     * This method safely escapes the values.
     */
});

// Start the server and listen for incoming requests on the defined port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Logs a message when the server starts
});
