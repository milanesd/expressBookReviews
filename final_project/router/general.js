const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
  if (filteredIsbns.length > 0)
  {
      let foundIsbn = filteredIsbns[0];
      let book = books[foundIsbn];
      res.send(JSON.stringify(book)+'\n');
  } else {
      res.status(300).json({message: "Unable to find isbn: " + isbn});
  }
  return 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let foundAuthors = [];
    for(i in books) {
        let book = books[i];
        if ( author === book.author ) {
            foundAuthors.push(book);
        }
    }
    if (foundAuthors.length > 0) {
        res.send(JSON.stringify(foundAuthors)+'\n');
    } else {
        
        res.status(300).json({message: "Unable to find author: " + author});
    }
  return 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let foundTitles = [];
    for(i in books) {
        let book = books[i];
        if ( title === book.title ) {
            foundTitles.push(book);
        }
    }
    if (foundTitles.length > 0) {
        res.send(JSON.stringify(foundTitles)+'\n');
    } else {
        
        res.status(300).json({message: "Unable to find title: " + title});
    }
  return 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
    if (filteredIsbns.length > 0)
    {
        let foundIsbn = filteredIsbns[0];
        let book = books[foundIsbn];
        res.send(JSON.stringify(book.review)+'\n');
    } else {
        res.status(300).json({message: "Unable to find isbn: " + isbn});
    }
    return 
});

module.exports.general = public_users;
