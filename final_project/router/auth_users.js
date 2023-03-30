const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{ return user.username === username });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  req.session.save();
  return res.status(200).send("User successfully logged in\n");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
    const review = req.body.review;
    const username = req.body.username;
    const isbn = req.params.isbn;

    let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
    if (filteredIsbns.length > 0)
    {
        books[isbn].reviews[username] = review;
        return res.send("The review for the book with ISBN: " + isbn + "; has been added/updated.\n" + JSON.stringify(books[isbn].reviews));
    } else {
        return res.send("Unable to find ISBN: "+ isbn + "\n");
    }

});

// Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const review = req.body.review;
    const username = req.body.username;
    const isbn = req.params.isbn;

    let filteredIsbns = Object.keys(books).filter((book) => book === isbn);
    if (filteredIsbns.length > 0)
    {
        delete books[isbn].reviews[username];
        return res.send("The review for the book with ISBN: " + isbn + "; has been deleted.\n");
    } else {
        return res.send("Unable to find ISBN: "+ isbn + "\n");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
