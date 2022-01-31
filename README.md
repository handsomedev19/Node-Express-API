###  ExpressJS API
#### NOTE: This is for the understanding of code pattern.
#### Author: handsomedev19

## prerequisite
1. Node v7+
2. MySQL database

## Installation Guide
1. Open the terminal
    Run command "npm install"
2. Create a MySQL databse "expressdb"
    You can create manually or use code
    If you wnat to use the code, then unwrap the slash the part of code "create database"
3. Table "posts" is created automatically.
4. You can seed some of data if you want.
    Unwrap the slash the part of code "db seed"
5. Run command "node app.js"


## Check if the server is running
You can see "ExpressAPI app listening at http://localhost:3000" on the terminal

## Check if the server is connect to the database
You can see "Database connected!" on the terminal

## API list
In total, there are five APIs

'/'         [GET]       : check if the server is running well

'/post'     [GET]       : get all the posts

'/post'     [POST]      : add a new post

'/post'     [PUT]       : edit a post

'/post'     [DELETE]    : delete a post

'post/avg'  [GET]       : get an average rating of the post


## validatation function
1. validate if the lengths of 'name', 'comment' are longer than 1 and shorter than 255.
2. validate if the rating is between 1 to 5.
