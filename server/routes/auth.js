const sql = require('mysql');
const db=require('../dbconn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
dotenv.config();
require('custom-env').env('dev');

const withAuth = require('../middleware/is-auth');

let router = require('express').Router();

const SALT=10;

const SECRET = process.env.TOKEN_SECRET;

router.get('/users/:role', withAuth,function(req, res){

    //let countryId = req.params.countryId;

    let role = req.params.role;

    let sql=`SELECT users.id,login,users.name,email,r.name as role, last_login, ct.name_en as country,users.countryId 
    FROM users, user_roles r, country ct WHERE users.roleId=r.id AND users.countryId=ct.id`;

    if(role == 'super_user'){

        sql=`SELECT users.id,login,users.name,email,r.name as role, last_login, ct.name_en as country,users.countryId 
            FROM users, user_roles r, country ct WHERE users.roleId=r.id AND users.countryId=ct.id`;
    }
    
    db.query(sql,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/users', withAuth,function(req, res){

    let sql=`SELECT users.id,login,users.name,email,r.name as role, last_login, ct.name_en as country,users.countryId 
    FROM users, user_roles r, country ct WHERE users.roleId=r.id AND users.countryId=ct.id`;

    
    db.query(sql,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

let getUserByLogin = async login => {

    let sql = `SELECT u.id, u.name AS name, u.login, u.email, u.password, u.countryId, r.id AS roleId, 
                u.languageCode as language,r.name AS role
                 FROM users u, user_roles r WHERE u.roleId=r.id AND 
                login ="${login}";`

    let results = await new Promise((resolve, reject) => db.query(sql, function (error, results) {
            if (error) {
                reject(error)
            } else {
                resolve(results);
            }
    }));
 
    return results[0];
}

router.post('/login', async function(req, res, next){

    let login = req.body.login;

    let password=req.body.password;

    let user = await getUserByLogin(login);

    if(!user){
        console.log("A user with this login could not be found");
        res.status(400);
        res.setHeader('Content-type','application/json');
        res.send(JSON.stringify('A user with this login could not be found'));
        return;
    }

    bcrypt.compare(password, user.password, function(err, isEqual) {
        if(!isEqual){
            console.log("Wrong password");
            res.status(401);
            res.setHeader('Content-type','application/json');
            res.send(JSON.stringify('Wrong password'));
            return;
        }
        const token = jwt.sign(
            {
                username:user.name,
                id: user.id.toString(),
                
            }, SECRET,
            {
                expiresIn: '1h'
            }
        );
        res.status(200).json({
            token : token,
            userId : user.id,
            username: user.name,
            email: user.email,
            countryId: user.countryId,
            roleId: user.roleId,
            role: user.role,
            language:user.language
        });
    })
});


router.get('/get_user/:userId',withAuth, function(req, res){

    let userId = req.params.userId;

    console.log(userId)
    
    db.query(`SELECT u.id, u.name AS name, u.login, u.email, u.countryId, r.id AS roleId, 
                r.name AS role, u.languageCode AS languageCode, u.last_login,l.name as language 
                FROM users u, user_roles r, system_languages l WHERE u.id =${userId} AND 
                u.roleId = r.id AND u.languageCode=l.code;`,function(error,results,fields){

        if(error) throw error;

        res.json(results[0]);
    });
});

router.patch('/change_password', withAuth,function(req, res){

    let userId=req.body.userId;
    
    let password=req.body.password;

    bcrypt.hash(password,SALT).then(hashedPwd => {

        db.query(`UPDATE users SET password="${hashedPwd}" WHERE id=${userId}` ,function(error,results,fields){
            if(error) throw error;
            res.status(200).send("Password changed successfully");
        });

    }).catch(err => {
        res.status(500).send(err);
    })
});

router.patch('/reset_password', withAuth, function(req, res){

    let login = req.body.login;

    let userId = req.body.userId;

    bcrypt.hash(login,SALT).then(hashedPwd => {

        db.query(`UPDATE users SET password="${hashedPwd}" WHERE id="${userId}"` ,function(error,results,fields){
            if(error) throw error;
            res.status(200).send("Password changed successfully");
        });

    }).catch(err => {
        res.status(500).send(err);
    })
});

router.patch('/set_last_login', withAuth, function(req, res){

    let userId=req.body.userId;
    
    db.query(`UPDATE users SET last_login = SYSDATE() WHERE id=${userId}` ,function(error,results,fields){
            if(error) throw error;
            res.status(200).send("Last login set successfully");
    });
});

router.patch('/change_language', withAuth, function(req, res){

    let userId = req.body.userId;

    let codeLang = req.body.codeLang;
    
    db.query(`UPDATE users SET languageCode = "${codeLang}" WHERE id=${userId}` ,function(error,results,fields){
            if(error) throw error;
            res.status(200).send("Language changed successfully");
    });
});


router.post('/signup', withAuth,async function(req, res){

    let login=req.body.login;

    let user = await getUserByLogin(login);

    if(user){//Login exists
        res.status(401).send('Login exists!');
        return;
    }

    let email=req.body.email;
    let name=req.body.name;
    let countryId=req.body.countryId;
    let roleId = req.body.roleId;
    let language = req.body.language;

    bcrypt.hash(login,SALT).then(hashedPwd => {

        db.query(`INSERT INTO users(login,name,email,password,countryId,roleId,languageCode) VALUES(
                "${login}","${name}","${email}","${hashedPwd}",${countryId},${roleId},"${language}");` ,function(error,results,fields){
                if(error) throw error;
               res.status(200).send("User created successfully!");
        });

    })
});

router.get('/roles',withAuth, (req, res) => {

    db.query(`SELECT * FROM user_roles`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

module.exports = router;