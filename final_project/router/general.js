const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

let getBooks = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books))
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks.then((books) => {
    return res.send(books)
  })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let getBookByIsbn = new Promise((resolve,reject) => {
    let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
    if (filteredIsbns.length > 0)
    {
        let foundIsbn = filteredIsbns[0];
        let book = books[foundIsbn];
        resolve(JSON.stringify(book)+'\n');
    } else {
        resolve("Unable to find ISBN");
    }
    })

    return res.send(await getBookByIsbn)
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author;
    let foundAuthors = [];
    let getBookByAuthor = new Promise((resolve, reject) => {
        
    for(i in books) {
        let book = books[i];
        if ( author === book.author ) {
            foundAuthors.push(book);
        }
    }
    if (foundAuthors.length > 0) {
        resolve(JSON.stringify(foundAuthors)+'\n');
    } else {
        
        resolve("Unable to find author: " + author);
    }
    })

    return res.send(await getBookByAuthor)
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title;
    let foundTitles = [];
    let getBookByTitle = new Promise((resolve) => {
        for(i in books) {
            let book = books[i];
            if ( title === book.title ) {
                foundTitles.push(book);
            }
        }
        if (foundTitles.length > 0) {
            resolve(JSON.stringify(foundTitles)+'\n');
        } else {
            
            resolve("Unable to find title: " + title);
        }
    })
  return res.send(await getBookByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
    if (filteredIsbns.length > 0)
    {
        let foundIsbn = filteredIsbns[0];
        let book = books[foundIsbn];
        res.send(JSON.stringify(book.reviews)+'\n');
    } else {
        res.status(300).json({message: "Unable to find isbn: " + isbn});
    }
    return 
});

module.exports.general = public_users;
