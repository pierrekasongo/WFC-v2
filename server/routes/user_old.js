const sql = require('mysql');
const db=require('../dbconn')

const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive');
const utilizationRoute = require('./user/utilization');

let router = require('express').Router();


router.get('/facilities',function(req,res,next){
    db.query('SELECT * FROM Facilities',function(error,results,fields){
        if(error) throw error;
        res.send(JSON.stringify({results}));
        //res.send(JSON.stringify({"status":200,"error":null,"response":results}));
    });
});
// get list of facilities
/*router.get('/facilities', (req, res) => {
    db.query('SELECT Id AS id, Name AS name FROM Facilities',res);
    return (result => res.json(result.recordset));
        //.then(result => res.json(result.recordset))
       // .catch(err => res.sendStatus(500));
});*/

// get list of cadres
router.get('/cadres', (req, res) => {
    new sql.Request()
        .query('SELECT Id AS id, Job_Cadre AS name FROM cadre')
        .then(result => res.json(result.recordset))
        .catch(err => res.sendStatus(500));
});

router.get('/treatments', (req, res) => {
    new sql.Request()
        .query(`SELECT Id AS id, Treatment AS treatment FROM Treatments`)
        .then(results => res.json(results.recordset))
        .catch(err => res.sendStatus(500));
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);

module.exports = router;