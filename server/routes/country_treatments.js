const sql = require('mysql');
const db=require('../dbconn');
const path=require('path');
let router = require('express').Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv');

const countryId=52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

router.post('/insertTreatment', (req, res) => {

    var code=req.body.code;

    var cadre_code=req.body.cadre_code;
    
    var name=req.body.name;

    var duration=req.body.duration;

    db.query(`INSERT INTO country_treatment (std_code,cadre_code,name_std,duration) 
                VALUES("${code}","${cadre_code}","${name}",${duration})`,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

router.patch('/editTreatment', (req, res) => {

    let code = req.body.std_code;

    let value = req.body.value;

    let param=req.body.param;

    let sql="";

    if(param == "duration"){
        sql=`UPDATE country_treatment SET ${param} =${value} WHERE std_code ="${code}"`;
    }else{
        sql=`UPDATE country_treatment SET ${param} ="${value}" WHERE std_code ="${code}"`;
    }

    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.patch('/match_dhis2', (req, res) => {

    let code = req.body.code;

    let selectedTreatments = req.body.selectedTreatments;

    let sql=``;

    let dhis2_cd="";

    selectedTreatments.forEach(tr =>{
        dhis2_cd+=tr.code+`,`;
    });
    
    let dhis2_code=dhis2_cd.substring(0,dhis2_cd.length-1);

    db.query(`UPDATE country_treatment SET dhis2_code="${dhis2_code}" WHERE std_code="${code}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.get('/treatments', function(req, res){
    
    db.query(`SELECT t.std_code AS code, dhis2_code AS dhis2_code,c.name_fr AS cadre_name_fr,
            c.name_en AS cadre_name_en, t.name_customized AS name_cust,t.name_std AS name_std,  t.duration AS duration 
            FROM  country_treatment t, std_treatment st, std_cadre c 
            WHERE t.std_code=st.code AND st.cadre_code=c.code;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/treatments/:cadreCode',function(req, res){

    let cadreCode=req.params.cadreCode;

    let sql="";

    if(cadreCode == "0"){
        sql=`SELECT t.std_code AS code, dhis2_code AS dhis2_code,c.name_fr AS cadre_name_fr,
                c.name_en AS cadre_name_en, t.name_customized AS name_cust,t.name_std AS name_std,  t.duration AS duration 
                FROM  country_treatment t, std_treatment st, std_cadre c 
                WHERE t.std_code=st.code AND st.cadre_code=c.code`
    }else{
        sql=`SELECT t.std_code AS code, dhis2_code AS dhis2_code,c.name_fr AS cadre_name_fr,
        c.name_en AS cadre_name_en, t.name_customized AS name_cust,t.name_std AS name_std,  t.duration AS duration 
        FROM  country_treatment t, std_treatment st, std_cadre c 
        WHERE t.std_code=st.code AND st.cadre_code=c.code AND t.cadre_code="${cadreCode}"`;
    }

    db.query(sql,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/getTreatment/:cadreCode',function(req,res){

    let cadreCode=req.params.cadreCode;

    db.query(`SELECT ct.std_code AS std_code, ct.hris_code AS hris_code,
                ct.worktime AS worktime,ct.admin_task AS admin_task, std.name_fr
                AS name_fr, std.name_en AS name_en FROM country_cadre ct, std_cadre std 
                WHERE ct.std_code=std.code AND std_code="${cadreCode}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
})

router.delete('/deleteTreatment/:code', function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  country_treatment WHERE std_code="${code}"`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.post('/uploadTreatments',function (req, res) {

    if (!req.files){
        return res.status(400).send('No files were uploaded');
    }
       
    //The name of the input field
    let file = req.files.file;

    let filename = 'country_treatment.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`, function (err) {
        if (err){
            console.log("ERROR ", err);
            return res.status(500).send(err);
        }
            
        //res.status(200).send('File uploaded successfully');
        let sql = "";

        var obj = csv();
        
        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`).to.array(function (data) {
                
                for (var index = 1; index < data.length; index++) {

                    let std_code = data[index][0];

                    let dhis2_code = data[index][1];

                    let std_name = data[index][2];

                    let customized_name=data[index][3];

                    let std_cadre_code = data[index][4];

                    let duration = data[index][6];

                    sql += `INSERT INTO country_treatment(std_code,dhis2_code,cadre_code,name_std,name_customized,duration) VALUES("${std_code}","${dhis2_code}","${std_cadre_code}","${std_name}","${customized_name}",${duration}) 
                            ON DUPLICATE KEY UPDATE dhis2_code="${dhis2_code}",cadre_code = "${std_cadre_code}",name_std="${std_name}",name_customized="${customized_name}", duration=${duration};`;
                }

                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.status(200).send('File uploaded successfully');
                });
        });
    });
})
module.exports = router;