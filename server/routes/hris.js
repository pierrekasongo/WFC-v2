const sql = require('mysql');
const db = require('../dbconn')
const fileUpload = require('express-fileupload');
const path = require('path');
const csv = require('csv');

const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive');
const utilizationRoute = require('./user/utilization');

let router = require('express').Router();

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

let countryCode = 'CD';

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
// get list of facilities
router.get('/facilities', (req, res) => {

    let sql = `SELECT fa.code as code, fa.id AS id, fa.name as name, rg.name as region, dist.name as district 
                 FROM facility fa, region rg, district dist WHERE fa.districtCode=dist.code
                 AND dist.regionCode=rg.code AND districtCode IN 
                (SELECT code FROM district WHERE regionCode 
                    IN(SELECT code FROM region WHERE countryCode ="${countryCode}") );`;

    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/facility_tree', function (req, res) {

    db.query(`SELECT DISTINCT(regionName) AS region FROM facilities WHERE selected=1;`, function (error, results, fields) {
        if (error) throw error;
        let tree = {};
        let region = "";
        let district = "";
        results.forEach(row => {

            region = row['region'];

            db.query(`SELECT DISTINCT(districtName) AS district FROM facilities 
                            WHERE regionName='`+ row['region'] + `' AND selected=1;`, function (err, res, fld) {
                    if (err) throw err;

                    res.forEach(r => {

                        district = r['district'];

                        db.query(`SELECT id,facilityCode,facilityName FROM facilities 
                                    WHERE districtName='`+ r['district'] + `' AND selected=1;`, function (er, rs, fd) {
                                if (er) throw er;
                                rs.forEach(rec => {

                                    facilityName = rec['facilityName'];

                                    //console.log(facilityName);
                                });
                            });

                    });
                });



            /*treatments[row['id']] = {
                id:row['id'],
                treatment: row['activityName'],
                cadre:row['cadre'],
                duration:row['duration']
            };*/

        });

        //res.json(treatments);
    });
});

router.get('/count_facilities', (req, res) => {
    db.query('SELECT COUNT(id) AS nb FROM facilities', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});
// get list of selected facilities
router.get('/selected_facilities', (req, res) => {

    db.query('SELECT * FROM facilities WHERE selected=1', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/facilitiesByDistrict/:districtCode', (req, res) => {

    let districtCode = req.params.districtCode;
    db.query('SELECT * FROM facility WHERE districtCode="' + districtCode + '"',
        function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

//Update facility selected state
router.patch('/facilities/:id', (req, res) => {

    var id = parseInt(req.params.id.toString());

    var selected = parseInt(req.body.selected.toString());

    db.query(`UPDATE facilities SET selected =` + selected + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
//Update hours per week for a cadre
router.patch('/cadre/hours/:id', (req, res) => {

    var id = parseInt(req.params.id.toString());

    var value = parseInt(req.body.hours.toString());

    db.query(`UPDATE cadre SET hoursPerWeek =` + value + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

//Update hours per week for a cadre
router.patch('/cadre/admin_work/:id', (req, res) => {

    var id = parseInt(req.params.id.toString());

    var value = parseInt(req.body.admin_task.toString());

    db.query(`UPDATE cadre SET adminTask =` + value + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

// get list of cadres
router.get('/cadres', (req, res) => {
    db.query(`SELECT ct.std_code AS code,CONCAT(st.name_fr,"/",st.name_en) AS name,
                ct.work_days AS work_days,ct.work_hours AS work_hours,ct.admin_task AS admin_task,
                ct.annual_leave AS annual_leave, ct.sick_leave AS sick_leave,
                ct.other_leave AS other_leave  FROM country_cadre ct, std_cadre st
                WHERE ct.std_code=st.code `, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/regions', (req, res) => {
    db.query('SELECT id,code,countryCode, name FROM region', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});
router.get('/districts', (req, res) => {
    db.query('SELECT id,code,regionCode, name FROM district', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/districtsByRegion/:regionCode', (req, res) => {
    var regionCode = req.params.regionCode.toString();

    db.query('SELECT id,code,regionCode, name FROM district WHERE regionCode ="' + regionCode + '"', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})
router.get('/count_cadres', (req, res) => {
    db.query('SELECT COUNT(id) AS nb FROM cadre', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.patch('/editHR', (req, res) => {

    let id = req.body.id;

    let value = req.body.value;

    let param=req.body.param;

    db.query(`UPDATE staff SET ${param} ="${value}" WHERE id =${id}`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
// get list of available workforce by cadre and facility
router.get('/workforce', (req, res) => {

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
            fa.name AS facility,CONCAT(cstd.name_fr,'/',cstd.name_en) AS cadre  FROM 
                staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
                s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
                AND ca.std_code=cstd.code`, function (error, results, fields) {
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
        fa.name AS facility,CONCAT(cstd.name_fr,'/',cstd.name_en) AS cadre  FROM 
        staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
        s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
        AND ca.std_code=cstd.code GROUP BY s.cadreCode`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

router.delete('/deleteWorkforce/:id', function(req, res){

    let id=req.params.id; 

    db.query(`DELETE FROM  staff WHERE id=${id}`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.get('/workforce/:cadre_code', (req, res) => {

    cadreCode=req.params.cadre_code;
    
    db.query(`SELECT s.id AS id,s.staffCount AS staff,
        fa.name AS facility,CONCAT(cstd.name_fr,'/',cstd.name_en) AS cadre  FROM 
        staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
        s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
        AND ca.std_code=cstd.code AND s.cadreCode="${cadreCode}"`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});
//get list of treatments
router.get('/activities', (req, res) => {
    db.query(`SELECT id AS id, activityName AS activityName FROM activities`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.post('/uploadHR', function (req, res) {

    if (!req.files) {
        return res.status(400).send('No files were uploaded');
    }

    //The name of the input field
    let file = req.files.file;

    let filename = 'workforce.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${filename}`,function (err) {
        if (err) {
            console.log("ERROR ", err);
            return res.status(500).send(err);
        }

        var obj = csv();
        
        let sql=``;

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${filename}`).to.array(function (data) {

            for (var index = 1; index < data.length; index++) {//index starts by 2 to length-1 to avoid <table> header and footer

                let facility_code = data[index][0];

                let cadre_code = data[index][2];

                let staff_count = data[index][4];

                console.log(facility_code,cadre_code,staff_count);

                sql += `INSERT INTO staff (facilityCode,cadreCode,staffCount) VALUES("
                       ${facility_code}","${cadre_code}",${staff_count});`;
            }
            db.query(sql, function (error, results) {
                if (error) throw error;
                res.status(200).send('File uploaded successfully');
            });
        });

    });
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);

module.exports = router;