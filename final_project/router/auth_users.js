const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: '5m' });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in with token:" + accessToken);
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn];

    if (filtered_book) {
      let username = req.session.authorization.username;
      let review = req.query.review;

        if(review) {
          
            let reviews = filtered_book["reviews"];

            if(reviews.length == 0){
              filtered_book["reviews"].push({username, review });
              res.send(`${username}, your review has been added. \n ${  JSON.stringify(books[isbn],null,4)}`);
            }
            else {
                let user = reviews.filter((y) => y.username == username);
                if(user.length != 0){
                  reviews.forEach((element, index) => {
                    console.log("ele", element, index);
                    if(element.username === username) {
                        element.review = review;
                    }
                  });
                //   books[isbn] = filtered_book;
                  res.send(`Review of ${username} has been updated. \n ${  JSON.stringify(books[isbn],null,4)}`);
                }
                else 
                  filtered_book.reviews.push({username, review });
                  console.log(filtered_book);
                  books[isbn] = filtered_book;
                  res.send(`${username}, your review has been added. \n ${  JSON.stringify(books[isbn],null,4)}`);
              }
        }
        else{
          res.send("No review was provided!");
        }
        
    }
    else{
        res.send("Unable to find book!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn];
  
    if (filtered_book) {
      let username = req.session.authorization.username;
      let reviews = filtered_book["reviews"];
      reviews = reviews.filter((review) => review.username != username);
      console.log(reviews);
      filtered_book.reviews = reviews;
      res.send(`${username}, your review is deleted \n ${  JSON.stringify(books[isbn],null,4)}`);
    }
    else{
      res.send("book not found");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
