const express = require('express');
const sql = require('mysql');
const db=require('../dbconn');
const path=require('path');
const stringify=require('csv-stringify');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv');
const mime=require('mime');

const withAuth = require('../middleware/is-auth')

let router = express.Router();

let countryId = 52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

router.get('/cadres',withAuth, function(req, res){
    
    db.query(`SELECT * FROM  std_cadre;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/getCadre/:cadreCode',withAuth, function(req,res){

    let cadreCode=req.params.cadreCode;

    db.query(`SELECT * FROM std_cadre WHERE code="${cadreCode}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

router.get('/countries',withAuth, function(req, res){
    
    db.query(`SELECT * FROM  country;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/treatments',withAuth, function(req, res){
    
    db.query(`SELECT t.code AS code,t.cadre_code AS cadre_code,c.name AS cadre,
            t.name AS name,t.name AS name, ft.name AS facility_type,  
            t.duration AS duration FROM  std_treatment t, std_cadre c, std_facility_type ft 
            WHERE t.cadre_code=c.code AND t.facility_type=ft.code;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/getTreatment/:code',withAuth, function(req,res){

    let code=req.params.code;

    db.query(`SELECT t.code AS code,t.cadre_code AS cadre_code,c.name AS cadre,
                t.name AS name, t.duration AS duration, facility_type AS facility_type 
                FROM  std_treatment t, std_cadre c 
                WHERE t.cadre_code=c.code AND t.code="${code}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

router.get('/treatments/:cadreCode',withAuth, function(req, res){

    let cadreCode=req.params.cadreCode;

    let sql="";

    if(cadreCode == "0"){
        sql=`SELECT t.code AS code,t.cadre_code AS cadre_code, t.facility_type, c.name AS cadre,
            t.name AS name, t.duration AS duration 
            FROM  std_treatment t, std_cadre c 
            WHERE t.cadre_code=c.code`
    }else{
        sql=`SELECT t.code AS code,t.cadre_code AS cadre_code,  t.facility_type,c.name AS cadre,
            t.name, t.duration AS duration 
            FROM  std_treatment t, std_cadre c 
            WHERE t.cadre_code=c.code AND cadre_code="${cadreCode}"`;
    }
    db.query(sql,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/countries/:id',withAuth, function(req, res){

    let id=req.params.id; 

    db.query(`SELECT * FROM  country WHERE id=${id}`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.delete('/deleteCadre/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  std_treatment WHERE cadre_code=${code};DELETE FROM  std_cadre WHERE code=${code};`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.delete('/deleteCountry/:id',withAuth, function(req, res){

    let id=req.params.id; 

    db.query(`DELETE FROM  users WHERE countryId=${id};DELETE FROM  country WHERE id=${id};`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.delete('/deleteTreatment/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  std_treatment WHERE code="${code}"`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.post('/insertCadre',withAuth, (req, res) => {

    let code = req.body.code;

    let name = req.body.name;

    let worktime=req.body.worktime;

    let admin_task=req.body.admin_task;

    db.query(`INSERT INTO std_cadre(code,name,worktime,admin_task) 
            VALUES("${code}","${name}",${worktime},${admin_task})`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.post('/updateCadre',withAuth, (req, res) => {

    let code = req.body.code;

    let name = req.body.name;

    let worktime=req.body.worktime;

    let admin_task=req.body.admin_task;

    db.query(`UPDATE std_cadre SET name="${name}", 
                admin_task=${admin_task} WHERE code="${code}"`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.post('/insertCountry',withAuth, (req, res) => {

    let code = req.body.code;

    let name_fr = req.body.name_fr;

    let name_en=req.body.name_en;

    db.query(`INSERT INTO country(code,name_fr,name_en) VALUES("${code}","${name_fr}","${name_en}")`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.post('/insertTreatment',withAuth, (req, res) => {

    let code = req.body.code;

    let facility_type=req.body.facility_type;

    let cadre_code=req.body.cadre_code;

    let name = req.body.name;

    let duration = req.body.duration;

    db.query(`INSERT INTO std_treatment(code,cadre_code,name,facility_type,duration) 
                VALUES("${code}","${cadre_code}","${name}","${facility_type}",${duration})`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});


router.patch('/editCountry',withAuth, (req, res) => {

    let id=req.body.id;

    let code = req.body.code;

    let value = req.body.value;

    let param=req.body.param;

    let sql="";

    if(param.includes("holidays")){

        sql=`UPDATE country SET ${param} =${value} WHERE id =${id}`;
    }else{
        sql=`UPDATE country SET ${param} ="${value}" WHERE id =${id}`;
    }

    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.patch('/editTreatment',withAuth, (req, res) => {

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


module.exports = router;