const sql = require('mysql');
const db = require('../dbconn')
const fileUpload = require('express-fileupload');
const path = require('path');
const csv = require('csv');


let config = require('./configuration.js');

let router = require('express').Router();

const withAuth = require('../middleware/is-auth')

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

let countryId = 52;

/************API***********/
router.post('/push',withAuth,function(req,res){

    var success = 0;
    var failure = 0;

    var data =[
        {
            "Code":"code",
            "Facility_type_code":"facility type code",
            "Name":"name",
            "Work_days":0,
            "Work_hours":0,
            "Annual_leave":0,
            "Sick_leave":0,
            "Other_leave":0,
            "Admin_task":0,
        }
    ]
    var data = req.body;

    var sql = ``;

    data.forEach(obj => {

        var code = obj["Code"];
        var facility_type = obj["Facility_type_code"]
        var name = obj["Name"];
        var work_days = obj["Work_days"];
        var work_hours = obj["Work_hours"];
        var annual_leave = obj["Annual_leave"];
        var sick_leave = obj["Sick_leave"];
        var other_leave = obj["Other_leave"];
        var admin_task = obj["Admin_task"];
       
        sql += `DELETE FROM std_cadre WHERE code="${code}"  AND countryId=${countryId};`;

        sql += `INSERT INTO std_cadre(code,countryId,facility_type_id,name,work_days,work_hours,annual_leave,sick_leave,other_leave,admin_task)
                 VALUES("${code}",${countryId},"${facility_type}","${name}",${work_days},${work_hours},${annual_leave},${sick_leave},${other_leave},${admin_task});`;
    })
    db.query(sql, function (error, results) {
        if (error){
            //throw error;
            res.status(500).send(error)
        } 
        
        res.status(200).json(results);
    });
})


/**********************END API ****************/

router.get('/getCadre/:cadreCode',withAuth, function(req,res){

    let cadreCode=req.params.cadreCode;

    db.query(`SELECT * FROM std_cadre WHERE code="${cadreCode}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

//Update hours per week for a cadre
router.patch('/cadre/hours/:id',withAuth, (req, res) => {

    var id = parseInt(req.params.id.toString());

    var value = parseInt(req.body.hours.toString());

    db.query(`UPDATE cadre SET hoursPerWeek =` + value + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

router.patch('/editCadre', withAuth,(req, res) => {

    let code = req.body.code;

    let value = req.body.value;

    let param=req.body.param;

    let sql="";

    sql=`UPDATE std_cadre SET ${param} =${value} WHERE code ="${code}"`;

    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

//Update hours per week for a cadre
router.patch('/cadre/admin_work/:id',withAuth, (req, res) => {

    var id = parseInt(req.params.id.toString());

    var value = parseInt(req.body.admin_task.toString());

    db.query(`UPDATE cadre SET adminTask =` + value + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

// get list of cadres
router.get('/cadres/:countryId',withAuth, (req, res) => {

    var countryId = req.params.countryId;

    db.query(`SELECT * FROM std_cadre  WHERE countryId = ${countryId} `, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

router.get('/count_cadres/:countryId',withAuth, (req, res) => {

    var countryId = req.params.countryId;
    db.query(`SELECT COUNT(code) AS nb FROM std_cadre WHERE countryId = ${countryId}`, function (error, results, fields) {
        if (error) throw error;
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

router.post('/insertCadre',withAuth, (req, res) => {

    let code = req.body.code;

    let name = req.body.name;

    let worktime=req.body.worktime;

    let admin_task=req.body.admin_task;

    let countryId = req.body.countryId;

    db.query(`INSERT INTO std_cadre(code,name,worktime,admin_task,countryId) 
            VALUES("${code}","${name}",${worktime},${admin_task},${countryId})`, 
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


module.exports = router;