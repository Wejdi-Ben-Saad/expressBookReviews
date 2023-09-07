const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}



const authenticatedUser = (username,password)=>{
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
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if(req.session.authorization) {
    username = req.session.authorization['username'];
  }
  if (book && username){
    let review=req.query.review
    if (review){
      book.reviews[username]=review
    }
    books[isbn]=book
    res.send(`Review for book with the ISBN  ${isbn} updated.`);
  }else{
    res.send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(req.session.authorization) {
    username = req.session.authorization['username'];
    if (isbn){
      delete books[isbn].reviews[username]
    }
    res.send(`review Book with the isbn ${isbn} added by user ${username} deleted.`); 
  }
  else{
    res.status(400).send('only logged in users can delete reviews ')
  }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
