const express = require('express');
const db = require('../dbconn');


let router = express.Router();

router.patch('/config', (req, res) => {

    let id = parseInt(req.body.id.toString());

    let value = req.body.value.toString();

    db.query(`UPDATE config SET value ="` + value + `" WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.get('/configs', function (req, res) {
    
    let countryId=52;

    db.query(`SELECT id, parameter, value FROM  config WHERE country_id =`+countryId,
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