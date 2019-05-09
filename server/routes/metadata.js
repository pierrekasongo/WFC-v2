const express = require('express');
const sql = require('mysql');
const db=require('../dbconn');
const path=require('path');
const stringify=require('csv-stringify');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv');
const mime=require('mime');

const withAuth=require('./middleware');

let router = express.Router();

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

router.get('/cadres'/*,withAuth,*/, function(req, res){
    
    db.query(`SELECT * FROM  std_cadre;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/treatments'/*,withAuth,*/, function(req, res){
    
    db.query(`SELECT * FROM  std_treatment;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/treatments/:cadreCode',withAuth, function(req, res){

    let cadreCode=req.params.cadreCode; 
    db.query(`SELECT * FROM  std_treatment WHERE cadre_code="${cadreCode}"`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.delete('/deleteCadre/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  std_treatment WHERE cadre_code="${code}";DELETE FROM  std_cadre WHERE code="${code}";`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.delete('/deleteTreatment/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  std_treatment WHERE cadre_code="${code}"`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.patch('/editCadre', (req, res) => {

    let code = req.body.code;

    let value = req.body.value;

    let param=req.body.param;

    db.query(`UPDATE std_cadre SET ${param} ="${value}" WHERE code ="${code}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.patch('/editTreatment', (req, res) => {

    let id = parseInt(req.body.id.toString());

    let value = req.body.value.toString();

    let param=req.body.param.toString();

    db.query(`UPDATE std_treatment SET ${param} ="${value}" WHERE id =${id}`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.post('/uploadCadres',withAuth, function (req, res) {

    if (!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file = req.files.file;

    let filename = 'std_cadre.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`, function (err) {
        if (err)
            return res.status(500).send(err);
        //res.status(200).send('File uploaded successfully');
        let sql = "";

        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`).to.array(function (data) {
                
                for (var index = 1; index < data.length; index++) {

                    let code = data[index][0];

                    let name_fr = data[index][1];

                    let name_en = data[index][2];

                    sql += `INSERT INTO std_cadre(code,name_fr,name_en) VALUES("${code}","${name_fr}","${name_en}") 
                            ON DUPLICATE KEY UPDATE name_fr="${name_fr}",name_en = "${name_en}";`;
                }

                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.status(200).send('File uploaded successfully');;
                });
        });
    });
})

router.post('/uploadTreatments',withAuth, function (req, res) {

    if (!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file = req.files.file;

    let filename = 'std_treatment.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`, function (err) {
        if (err)
            return res.status(500).send(err);
        //res.status(200).send('File uploaded successfully');
        let sql = "";

        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`).to.array(function (data) {
                
                for (var index = 1; index < data.length; index++) {

                    let code = data[index][0];

                    let cadre_code = data[index][1];

                    let name_fr = data[index][2];

                    let name_en = data[index][3];

                    let duration = data[index][4];

                    sql += `INSERT INTO std_treatment(code,cadre_code,name_fr,name_en,duration) VALUES("${code}","${cadre_code}","${name_fr}","${name_en}",${duration}) 
                            ON DUPLICATE KEY UPDATE name_fr="${name_fr}",name_en = "${name_en}",duration=${duration};`;
                }

                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.status(200).send('File uploaded successfully');;
                });
        });
    });
})

module.exports = router;