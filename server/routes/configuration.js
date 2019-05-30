const express = require('express');
const db = require('../dbconn');


let router = express.Router();

let countryId=52;

router.patch('/config', (req, res) => {

    let id = parseInt(req.body.id.toString());

    let value = req.body.value.toString();

    db.query(`UPDATE config SET value ="` + value + `" WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/configs', function (req, res) {

    db.query(`SELECT id, parameter, value FROM  config WHERE country_id =`+countryId,
        function (error, results, fields) {
            if (error) throw error;
            res.json(results);
    });
});

router.get('/getCountryHolidays', function (req, res) {

    db.query(`SELECT id, parameter, value FROM  config WHERE 
               parameter="COUNTRY_PUBLIC_HOLIDAYS" AND country_id =`+countryId,
        function (error, results, fields) {
            if (error) throw error;
            res.json(results);
    });
});

router.get('/getYears', (req, res) => {
    db.query('SELECT id,year FROM years',function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});
module.exports = router;