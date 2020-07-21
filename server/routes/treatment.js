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

let countryId = 52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

/************API***********/
router.post('/push',function(req,res){

    /*var data =[
        {
            "Code":"code",
            "Cadre_code":"cadre",
            "Name":"name",
            "Duration":0
        }
    ]*/
    var data = req.body;

    var sql = ``;

    data.forEach(obj => {

        var code = obj["Code"];
        var cadre_code = obj["Cadre_code"];
        var name = obj["Name"]
        var duration = obj["Duration"];
       
        sql += `DELETE FROM std_treatment WHERE code="${code}"  AND countryCode=${countryId};`;

        sql += `INSERT INTO std_treatment (code,cadre_code,countryId,name,duration)
                 VALUES("${code}","${cadre_code}",${countryId},"${name}",${duration});`;
    })
    db.query(sql, function (error, results) {
        if (error) throw error;
        // res.status(200).send('File uploaded successfully');
    });
})
/**********************END API ****************/

router.get('/count_treatments', (req, res) => {
    db.query(`SELECT COUNT(id) AS nb FROM std_treatment WHERE countryId = ${countryId}`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});


router.get('/treatments'/*,withAuth,*/, function(req, res){
    
    db.query(`SELECT t.code AS code,t.cadre_code AS cadre_code,c.name AS cadre,t.name AS name, ft.name as facility_type,
            t.duration AS duration FROM  std_treatment t, std_cadre c, std_facility_type ft
            WHERE t.cadre_code=c.code AND c.facility_type_id=ft.code;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/getTreatment/:code'/*,withAuth*/, function(req,res){

    let code=req.params.code;

    db.query(`SELECT t.code AS code,t.cadre_code AS cadre_code,c.name AS cadre,
                t.name AS name, t.duration AS duration
                FROM  std_treatment t, std_cadre c, std_facility_type ft
                WHERE t.cadre_code=c.code AND t.code="${code}" AND c.facility_type_id=ft.code`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

router.get('/treatments/:cadreCode',withAuth, function(req, res){

    let cadreCode=req.params.cadreCode;

    let sql="";

    if(cadreCode == "0"){
        sql=`SELECT t.code AS code,t.cadre_code AS cadre_code, c.name AS cadre,
            t.name AS name, t.duration AS duration 
            FROM  std_treatment t, std_cadre c,std_facility_type ft
            WHERE t.cadre_code=c.code AND c.facility_type_id=ft.code`
    }else{
        sql=`SELECT t.code AS code,t.cadre_code AS cadre_code,c.name AS cadre,
            t.name, t.duration AS duration 
            FROM  std_treatment t, std_cadre c,std_facility_type ft
            WHERE t.cadre_code=c.code AND cadre_code="${cadreCode}" AND c.facility_type_id=ft.code`;
    }
    db.query(sql,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.post('/insertTreatment',withAuth, (req, res) => {

    let code = req.body.code;

    let cadre_code=req.body.cadre_code;

    let name = req.body.name;

    let duration = req.body.duration;

    db.query(`INSERT INTO std_treatment(code,cadre_code,name,duration) 
                VALUES("${code}","${cadre_code}","${name}",${duration})`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.patch('/editTreatment', (req, res) => {

    let code = req.body.code;

    let value = req.body.value;

    let param=req.body.param;

    let sql="";

    if(param.includes("duration")){

        sql=`UPDATE std_treatment SET ${param} =${value} WHERE code ="${code}"`
    }else{
        sql=`UPDATE std_treatment SET ${param} ="${value}" WHERE code ="${code}"`;
    }

    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});


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

                    let name = data[index][2];

                    let duration = data[index][3];

                    sql += `INSERT INTO std_treatment(code,cadre_code,name,duration) VALUES("${code}","${cadre_code}","${name}",${duration}) 
                            ON DUPLICATE KEY UPDATE name="${name}",duration=${duration};`;
                }

                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.status(200).send('File uploaded successfully');;
                });
        });
    });
})

module.exports = router;