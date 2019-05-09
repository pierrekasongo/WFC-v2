const sql = require('mysql');
const db=require('../dbconn');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

let router = require('express').Router();

const SALT=10;

const countryId=52;

const SECRET = 'mysecretsshhh'; //Set the secret in a json secret file

router.post('/login', function(req, res){

    var login=req.body.login;

    var password=req.body.password;
    
    db.query(`SELECT * FROM users WHERE login ="${login}"  AND password ="${password}";` ,
        function(error,results,fields){

        if(error) throw error;

        if(results.length > 0){
            // Issue token
          const payload = { login };
          const token = jsonwebtoken.sign(payload, SECRET, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);

        }
    });
});
router.post('/logout', function(req, res){

    var login=req.body.login;

    var password=req.body.password;
    
    db.query(`SELECT * FROM users WHERE login ="${login}"  AND password ="${password}";` ,
        function(error,results,fields){

        if(error) throw error;

        if(results.length > 0){
            // Issue token
          const payload = { login };
          const token = jsonwebtoken.sign(payload, SECRET, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
            
        }
    });
});
router.post('/save', function(req, res){

    let login=req.body.login;
    let email=req.body.email;
    let name=req.body.name;
    let password=req.body.password;
    console.log("PASSWORD ",name);
    let hash = bcrypt.hashSync(password, SALT);
    
    db.query(`INSERT INTO users(login,name,email,password,countryId) VALUES 
    "${login}","${name}","${email}","${hash}",${countryId};` ,function(error,results,fields){
            if(error) throw error;
            res.status(200).send("User sent successfully");
    });
});

module.exports = router;