const sql = require('mysql');
const db = require('../dbconn');
const path = require('path');
let router = require('express').Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv');
const XLSX = require('xlsx');
const uniqueFilename = require('unique-filename');
const os = require('os');

const withAuth = require('../middleware/is-auth')


const countryId = 52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

//API

router.post('/push',withAuth,function(req,res){
    
    /*var data = [
        {
            "Facility_code":"faCode",
            "Cadre_code":"cdCode",
            "Activity_code":"trCode",
            "Year":"year",
            "Patients_count": 0
        }
    ]*/
    var data = req.body;

    var sql = ``;

    data.forEach(obj => {

        var facility_code = obj["Facility_code"];
        var cadre_code = obj["Cadre_code"];
        var activity_code = obj["Activity_code"];
        var patient_count = obj["Patients_count"];
        var year = obj["Year"];

        sql += `DELETE FROM activity_stats WHERE facilityCode="${facility_code}" AND activityCode="${activity_code}" AND cadreCode="${cadre_code}";`;

        sql += `INSERT INTO activity_stats (facilityCode,year,activityCode,cadreCode,caseCount) VALUES("
                   ${facility_code}","${year}","${activity_code}","${cadre_code}",${patient_count});`;
    })
    db.query(sql, function (error, results) {
        if (error) throw error;
        res.status(200).send('File uploaded successfully');
    });
})

/**************END API************* */

router.post('/uploadService', withAuth,function (req, res) {

    if (!req.files) {
        return res.status(400).send('No file uploaded');
    }

    //var filePath = `${__dirname}${path.sep}uploads${path.sep}`;

    //The name of the input field
    var file = req.files.file;

    var filename = uniqueFilename(os.tmpdir());

    file.mv(`${filename}`, function (err) {
        if (err) {
            console.log("ERROR ", err);
            return res.status(500).send(err);
        }

        var wb = XLSX.readFile(`${filename}`);

        var sheet_names = wb.SheetNames;

        var xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheet_names[0]]);
        
        var sql = ``;

        xlData.forEach(obj => {

            var facility_code = obj["Facility code"];
            var cadre_code = obj["Cadre code"];
            var activity_code = obj["Activity code"];
            var patient_count = obj["Patients count"];
            var year = obj["Year"];

            sql += `DELETE FROM activity_stats WHERE facilityCode="${facility_code}" AND activityCode="${activity_code}" AND cadreCode="${cadre_code}";`;

            sql += `INSERT INTO activity_stats (facilityCode,year,activityCode,cadreCode,caseCount) VALUES("
                       ${facility_code}","${year}","${activity_code}","${cadre_code}",${patient_count});`;
        })
        db.query(sql, function (error, results) {
            if (error) throw error;
            res.status(200).send('File uploaded successfully');
        });

    });
});

router.get('/treatments',withAuth, function (req, res) {

    db.query(`SELECT t.code AS code, dhis2_code AS dhis2_code,c.name,
            t.name AS name_cust,t.name AS name_std,  t.duration AS duration 
            FROM  country_treatment t, std_treatment st, std_cadre c 
            WHERE t.code=st.code AND st.cadre_code=c.code;`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

router.post('/generateStatTemplate',withAuth, function (req, res) {

    let cadre = req.body.selectedCadre;

    let period = req.body.selectedPeriod;

    let facility = req.body.selectedFacility;

    let statistics = [];

    let sql=``;
    
    let count=0;

    db.query(`SELECT * FROM country_treatment WHERE cadre_code="${cadre}"`, function (error, results, fields) {
        if (error) throw error;
        results.forEach(rs =>{

            let activityCode=rs.code;

            sql+=`INSERT INTO activity_stats(facilityCode,year,activityCode,cadreCode) VALUES(
                  "${facility}","${period}","${activityCode}","${cadre}");`;

            
        })
        db.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    });
})

router.delete('/delete/:id',withAuth, function (req, res) {

    let id = req.params.id;

    db.query(`DELETE FROM  activity_stats WHERE id=${id}`, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.get('/statistics/:countryId',withAuth, (req, res) => {

    var countryId = req.params.countryId;

    let sql = `SELECT act_st.id as id, fa.name as facility,act_st.cadreCode AS cadre_code, cd.name as cadre,
                 ct.name as treatment, act_st.caseCount as patients FROM facility fa, activity_stats act_st,
                 country_treatment ct, std_cadre cd WHERE act_st.facilityCode=fa.code AND 
                 act_st.activityCode=ct.code AND cd.code=act_st.cadreCode AND cd.countryId=${countryId}`;

    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.patch('/editPatientsCount',withAuth, (req, res) => {

    let id = req.body.id;

    let value = req.body.value;

    let param = req.body.param;

    db.query(`UPDATE activity_stats SET ${param} =${value} WHERE id =${id}`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});
module.exports = router;