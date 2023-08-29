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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const all_books = new Promise((resolve,reject) => {
        try {
          const data = JSON.stringify(books,null,4);
          resolve(data);
        } catch(err){
          reject(err);
        }
      });
  
      all_books.then((data) => {
        res.send(data);
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const book_details = new Promise((resolve,reject) => {
        try {
          const isbn = req.params.isbn;
          const data = books[isbn];
          resolve(data);
        } catch(err){
          reject(err);
        }
      });
    
      book_details.then((data) => {
        res.send(data);
      });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const book_details = new Promise((resolve,reject) => {
        try {
          const author = req.params.author;
          let books_data = Object.values(books);
          const data = books_data.filter((book) => book.author === author);
          resolve(data);
        } catch(err){
          reject(err);
        }
      });
    
      book_details.then((data) => {
        res.send(data);
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const book_details = new Promise((resolve,reject) => {
        try {
          const title = req.params.title;
          let books_data = Object.values(books);
          const data = books_data.filter((book) => book.title === title);
          resolve(data);
        } catch(err){
          reject(err);
        }
      });
    
      book_details.then((data) => {
        res.send(data);
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
