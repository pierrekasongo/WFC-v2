const sql = require('mysql');
const db=require('../dbconn')

let router = require('express').Router();

router.post('/login', function(req, res){

    var login=req.body.login.toString();
    var password=req.body.password.toString();
    
    db.query(`SELECT * FROM users WHERE login ="`+login+`"  AND password ="`+password+`";` ,function(error,results,fields){
                        if(error) throw error;
                        let user={};
                        results.forEach(row => {

                            user = {
                                id:row['id'],
                                login: row['login'],
                                name:row['name'],
                                country_id:row['country_id'],
                                last_login:row['last_login']
                            };
                           
                        });
                        res.json(user);
    });
});

module.exports = router;