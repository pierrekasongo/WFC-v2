const sql = require('mysql');
const db = require('../dbconn')
const fileUpload = require('express-fileupload');
const path = require('path');
const csv = require('csv');

const XLSX = require('xlsx');
const uniqueFilename = require('unique-filename');
const os = require('os');


const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive');
const utilizationRoute = require('./user/utilization');

let config = require('./configuration.js');

let router = require('express').Router();

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

let countryId = 52;


/***************API****************/

router.post('/push',function(req,res){

    /*var data =[
        {
        "Facility_code":"0001",
        "Cadre_code":"cd-00198",
        "Staff_count": 10
        }
    ]*/
    var data = req.body;

    var sql = ``;

    data.forEach(obj => {

        var facility_code = obj["Facility_code"];
        var cadre_code = obj["Cadre_code"];
        var staff_count = obj["Staff_count"];
       
        sql += `DELETE FROM staff WHERE facilityCode="${facility_code}"  AND cadreCode="${cadre_code}";`;

        sql += `INSERT INTO staff (facilityCode,cadreCode,staffCount) VALUES("
                   ${facility_code}","${cadre_code}",${staff_count});`;
    })
    db.query(sql, function (error, results) {
        if (error) throw error;
        res.status(200).send('File uploaded successfully');
    });

})

/************** END API **************/

router.post('/login', function (req, res) {

    var login = req.body.login.toString();
    var password = req.body.password.toString();

    db.query(`SELECT * FROM users WHERE login ="` + login + `"  AND password ="` + password + `";`, function (error, results, fields) {
        if (error) throw error;
        let user = {};
        results.forEach(row => {

            user[row['id']] = {
                id: row['id'],
                login: row['login'],
                name: row['name'],
                country_id: row['country_id'],
                last_login: row['last_login']
            };

        });
        res.json(user);
    });
});


router.patch('/editHR', (req, res) => {

    let id = req.body.id;

    let value = req.body.value;

    let param = req.body.param;

    db.query(`UPDATE staff SET ${param} ="${value}" WHERE id =${id}`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
// get list of available workforce by cadre and facility
router.get('/workforce', (req, res) => {

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
            fa.name AS facility,ca.name AS cadre  FROM 
                staff s,std_cadre ca, facility fa WHERE 
                s.facilityCode=fa.code AND s.cadreCode=ca.code`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

// get list of available workforce without caring about facility
router.get('/all_workforce', (req, res) => {
    db.query('SELECT id AS id,facilityId AS facilityId, facilityCode AS facilityCode FROM staff', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/count_staffs', (req, res) => {
    db.query('SELECT SUM(`staffCount`) AS nb FROM staff', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});
//get count staff per cadre
router.get('/staff_per_cadre', (req, res) => {

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
        fa.name AS facility,cstd.name AS cadre  FROM 
        staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
        s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
        AND ca.std_code=cstd.code GROUP BY s.cadreCode`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

router.delete('/deleteWorkforce/:id', function (req, res) {

    let id = req.params.id;

    db.query(`DELETE FROM  staff WHERE id=${id}`, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.get('/workforce/:cadre_code', (req, res) => {

    cadreCode = req.params.cadre_code;

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
        fa.name AS facility,cstd.name AS cadre  FROM 
        staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
        s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
        AND ca.std_code=cstd.code AND s.cadreCode="${cadreCode}"`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});


router.post('/uploadHR', function (req, res) {

    if (!req.files) {
        return res.status(400).send('No file uploaded');
    }

    //The name of the input field
    let file = req.files.file;

    var filename = uniqueFilename(os.tmpdir());

    file.mv(`${filename}`, function (err) {
        if (err) {
            console.log("ERROR ", err);
            return res.status(500).send(err);
        }


        var sheet_names = wb.SheetNames;

        var xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheet_names[0]]);
        
        var sql = ``;

        xlData.forEach(obj => {

            var facility_code = obj["Facility code"];
            var cadre_code = obj["Cadre code"];
            var staff_count = obj["Staff count"];
           
            sql += `DELETE FROM staff WHERE facilityCode="${facility_code}"  AND cadreCode="${cadre_code}";`;

            sql += `INSERT INTO staff (facilityCode,cadreCode,staffCount) VALUES("
                       ${facility_code}","${cadre_code}",${staff_count});`;
        })
        db.query(sql, function (error, results) {
            if (error) throw error;
            res.status(200).send('File uploaded successfully');
        });

    });
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);

module.exports = router;