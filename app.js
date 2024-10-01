const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'my_password',
    database: 'test'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.stack);
        return;
    }
    console.log('Connected to MariaDB as id ' + connection.threadId);

});


const createTableQuery = `
        CREATE TABLE IF NOT EXISTS names (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL
        )`;

connection.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    console.log('Table created or already exists.');
});



// const insertValuesQuery = `
//             INSERT INTO names (name, last_name) VALUES
//             ('imie','nazwisko')
//         `;

// connection.query(insertValuesQuery, (err, results) => {
//     if (err) {
//         console.error('Error inserting values:', err);
//         return;
//     }
//     console.log('Values inserted:', results.affectedRows);
// });




const selectQuery = 'SELECT * FROM names';
connection.query(selectQuery, (err, results) => {
    if (err) {
        console.error('Error selecting values:', err);
        return;
    }
    console.log('All records:', results);

});


connection.end();

