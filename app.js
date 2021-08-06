const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// db connection
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "expressdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");

  // ---------------- create database (ONLY ONE TIME, DO SLASH AGAIN AFTER THAT)------------------
  // con.query("CREATE DATABASE IF NOT EXISTS expressdb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
  // ---------------------------------------------------------------------------------------------

  // create 'posts' table
  var sql = "CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), rating INT, comment VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) 
      throw err;
    else
      console.log("Table created");
  });

  //---------------- db seed (ONLY ONE TIME, DO SLASH AGAIN AFTER THAT) -------------------------
  // var sql = "INSERT INTO posts (name, rating, comment) VALUES ?";
  // var values = [
  //   ['John', 4, 'Highway 71'],
  //   ['Peter', 5, 'Lowstreet 4']
  // ];
  // con.query(sql, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records inserted: " + result.affectedRows);
  // });
  //---------------------------------------------------------------------------------------------
});

//---------------------------------- Routing API ------------------------------------------------
app.get('/', function (req, res) {
  res.send('hello world')
})

// get all posts
app.get('/post', function(req, res) {
  con.query("SELECT * FROM posts", function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
    res.send(result);
  });
})

// add new post
app.post('/post', function(req, res) {

  let name = req.body.name;
  let rating = req.body.rating;
  let comment = req.body.comment;

  // validate inpute values
  let errMsg = '';
  if (!validateName(name)) {errMsg += 'invalid name \n'}
  if (!validateRating(rating)) {errMsg += 'invalid rating \n'}
  if (!validateComment(comment)) {errMsg += 'invalid comment \n'}
  if (errMsg != '') { res.send(errMsg); return; }

  // do db query
  var sql = "INSERT INTO posts (name, rating, comment) VALUES ?";
  let values = [[name, rating, comment]];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send("1 record inserted");
  });
})

// Remove a post by id
app.delete('/post', function (req, res) {
  let id = req.body.id;

  // do db query
  var sql = "DELETE FROM posts WHERE id = '" + id + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    res.send('removed a post');
  });
})

// Edit a post by id
app.put('/post', function (req, res) {

  let id  = req.body.id;
  let name = req.body.name;
  let rating = req.body.rating;
  let comment = req.body.comment;

  // validate inpute values
  let errMsg = '';
  if (!validateName(name)) {errMsg += 'invalid name \n'}
  if (!validateRating(rating)) {errMsg += 'invalid rating \n'}
  if (!validateComment(comment)) {errMsg += 'invalid comment \n'}
  if (errMsg != '') { res.send(errMsg); return; }

  // do db query
  var sql = "UPDATE posts SET name = '" + name + "', rating='" + rating + "', comment='" + comment + "' WHERE id = '" + id +"'";
  con.query(sql, function (err, result) {
    if (err) 
      throw err;
    else {
      console.log(result.affectedRows + " record(s) updated");
      res.send('updated a record');
    }
  });
})

// get average rating of posts
app.get('/post/avg', function(req, res) {
  // do db query
  con.query("SELECT * FROM posts", function (err, results, fields) {
    if (err) 
      throw err;
    else {
      console.log(results);
      let n = results.length;
      let sum = 0;
      results.forEach(row => {
        sum += parseInt(row.rating);
      });
      let avg = parseInt(sum/n);
      res.send("average rating is " + avg);
    }
  });
})
//-----------------------------------------------------------------------------------


//----------------------------- validation functions ---------------------------------
// validate name
function validateName(str){
  if (str == null || str == '' || str.length < 1 || str.length > 255) {
    //console.log("invalid comment");
    return false;
  }
  return true;
}
// validate rating
function validateRating(str){
  if (Number.isInteger(parseInt(str))) {
    if (parseInt(str) < 1 || parseInt(str) > 5) {
      //console.log("invalid rating");
      return false;
    }
  } else {
    return false;
  }
  return true;
}
// validate comment
function validateComment(str){
  if (str == null || str == '' || str.length < 1 || str.length > 255) {
    //console.log("invalid comment");
    return false;
  }
  return true;
}
//-----------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`ExpressAPI app listening at http://localhost:${port}`)
})