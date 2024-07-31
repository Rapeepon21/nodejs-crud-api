const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// homepage route
app.get('/', (req, res) => {
    return res.send({ 
        error: false, 
        message: 'Welcome to RESTful CRUD API with NodeJS, Express, MYSQL',
        written_by: 'Rapeepon',
        published_on: 'https://milerdev.dev'
    })
})

//connection to mysql database
 const dbCon= mysql.createConnection({
     host:'127.0.0.1',
     username:'root',
     passwordDB:'',
     databasename:'dev_intern',
     port:'3306'
     
})
dbCon.connect();

 //retrieve all books 
app.get('/books', (req, res) => {
        dbCon.query('SELECT * FROM dev_intern.books;', (error, results, fields) => {
           if (error) throw error;

            let message = ""
             if (results === undefined || results.length == 0) {
                 message = "Books table is empty";
             } else {
                 message = "Successfully retrieved all books";
             }
             return res.send({ error: false, data: results, message: message});
         })
 })

// add a new book
app.post('/book',(req,res)=>{
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if (!name||!author){
        return res.status(400).send({ error:true, message:"pleaseprovide book name and author."});
    } else{    
        dbCon.query('INSERT INTO dev_intern.books (name,author)VALUES(?, ?)', [name, author], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "Book successfully added"})
        })
    }
});

// retrieve book by id 
app.get('/book/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM  dev_intern.books WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully retrieved book data";
            }

            return res.send({ error: false, data: results[0], message: message })
        })
    }
})

// update book with id 
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if (!id || !name || !author) {
        return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
    } else {
        dbCon.query('UPDATE dev_intern.books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

// delete book by id
app.delete('/book', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM dev_intern.books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.affectedRows === 0) {
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})
        
    


app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;

