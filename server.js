const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const port = process.env.port || 3000;
const DATE_FORMATER = require( 'dateformat' );

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    user: "sql9374289",
    password: "WeBizLcqmq",
    database: "sql9374289"
  });

  encryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
     if (err) 
       return callback(err);
 
     bcrypt.hash(password, salt, function(err, hash) {
       return callback(err, hash);
     });
   });
 };

function transformDate(){
    var datetime = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
    return datetime;
}

app.post('/api/signup',async (req,res)=>{

    const {username, password} = req.body;
    console.log(username,password);
    const pwd = await bcrypt.hash(password,8);
    console.log(pwd);
    const date = transformDate();     // transform to mySQL date format
    //connection.connect();

    connection.query('INSERT INTO user (username,password,signedup) values (?,?,?)',[username,pwd,date],function(error,results, fields){
        //connection.end();
        if(error){
            throw error
        }
        res.json(results);
    });
});

app.get('/',async (req,res)=>{
    connection.connect();

    connection.query('SELECT * from budget',function(error,results, fields){
        connection.end();
        if(error){
            throw error
        }
        res.json(results);
    });
});

app.listen(port, ()=>{
    console.log("Server running on port "+port);
});