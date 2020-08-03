const sql = require('mysql');
const db=require('../dbconn');

let router = require('express').Router();

const withAuth = require('../middleware/is-auth')

const countryId=52;

//Update hours per week for a cadre
router.patch('/cadre/hours/:id',withAuth, (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.hours.toString());

    db.query(`UPDATE cadre SET hoursPerWeek =`+value+` WHERE id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

//Update hours per week for a cadre
router.patch('/cadre/admin_work/:id',withAuth, (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.admin_task.toString());

    db.query(`UPDATE cadre SET adminTask =`+value+` WHERE id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

router.post('/insertCadre',withAuth, (req, res) => {

    var stdCode=req.body.stdCode;

    var work_days=req.body.workDay;

    var work_hours=req.body.workHours;

    var annual_leave=req.body.annualLeave;

    var sick_leave=req.body.sickLeave;

    var other_leave=req.body.otherLeave
    
    var admin_task=req.body.adminTask;

    db.query(`INSERT INTO country_cadre (std_code,work_days,work_hours,
                annual_leave,sick_leave,other_leave,admin_task, country_id) 
                VALUES("${stdCode}",${work_days},${work_hours},${annual_leave},
            ${sick_leave},${other_leave},${admin_task},${countryId})`,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

router.patch('/editCadre',withAuth, (req, res) => {

    let code = req.body.std_code;

    let value = req.body.value;

    let param=req.body.param;

    let sql="";

    if(param == "hris_code"){
        sql=`UPDATE country_cadre SET ${param} ="${value}" WHERE std_code ="${code}"`;
    }else{
        sql=`UPDATE country_cadre SET ${param} =${value} WHERE std_code ="${code}"`;
    }
    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
// get list of cadres
router.get('/cadres',withAuth, (req, res) => {
        db.query(`SELECT * FROM  std_cadre WHERE countryId=${countryId}`,function(error,results,fields){
            if(error) throw error;
            res.json(results);
        });
});

router.get('/getCadre/:cadreCode',withAuth,function(req,res){

    let cadreCode=req.params.cadreCode;

    db.query(`SELECT ct.std_code AS std_code, ct.hris_code AS hris_code,
    ct.work_days AS work_days, ct.work_hours AS work_hours,
                ct.annual_leave AS annual_leave, ct.sick_leave AS sick_leave,
                ct.other_leave AS other_leave,ct.admin_task AS admin_task, std.name_fr
                AS name_fr, std.name_en AS name_en FROM country_cadre ct, std_cadre std 
                WHERE ct.std_code=std.code AND std_code="${cadreCode}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

router.delete('/deleteCadre/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  country_cadre WHERE std_code="${code}"`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});


module.exports = router;