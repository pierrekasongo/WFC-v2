const express = require('express');
const sql = require('mysql');
const db=require('../dbconn');
const path=require('path');
const stringify=require('csv-stringify');

const fs=require('fs');
const mime=require('mime')
let router = express.Router();

// update treatmnent info
router.patch('/config/:id', (req, res) => {
        /*new sql.Request()
        .input('Treatment', sql.NVarChar, req.body.treatment)
        .input('Ratio', sql.Float, req.body.ratio)
        .input('Id', sql.Int, req.params.id)*/
        db.query(`UPDATE treatments SET Treatment = @Treatment, Ratio = @Ratio
                    WHERE Id = @Id;
                SELECT * FROM treatments
                    WHERE Id = @Id`,function(error,results){
                        if(error)throw error;
                        res.json(results);

                        let tagwords={};

                        results.forEach(row => {
                            if (tagwords[row['tagword']] == null) {
                                tagwords[row['tagword']] = [];
                            }
                            tagwords[row['tagword']].push(row['indicator']);
                        });
                    })
        /*.then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500))*/
});

router.get('/configs', function(req, res){
    
    db.query(`SELECT id, parameter, value FROM  config;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

module.exports = router;