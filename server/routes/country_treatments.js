const sql = require('mysql');
const db = require('../dbconn');
const path = require('path');
let router = require('express').Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv');

const withAuth = require('../middleware/is-auth')

const countryId = 52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

//get list of treatments
router.get('/activities', withAuth,(req, res) => {
    db.query(`SELECT id AS id, activityName AS activityName FROM activities`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.post('/insertTreatment', withAuth,(req, res) => {

    var code = req.body.code;

    var cadre_code = req.body.cadre_code;

    var name = req.body.name;

    var duration = req.body.duration;

    db.query(`INSERT INTO country_treatment (code,cadre_code,name,duration) 
                VALUES("${code}","${cadre_code}","${name}",${duration})`, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
});

router.patch('/editTreatment',withAuth, (req, res) => {

    let code = req.body.code;

    let value = req.body.value;

    let param = req.body.param;

    let sql = "";

    if (param == "duration") {
        sql = `UPDATE country_treatment SET ${param} =${value} WHERE code ="${code}"`;
    } else {
        sql = `UPDATE country_treatment SET ${param} ="${value}" WHERE code ="${code}"`;
    }

    db.query(sql, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.get('/treatments', withAuth,function (req, res) {

    db.query(`SELECT t.code AS code,c.name cadre_name, t.name AS name, t.duration AS duration 
            FROM  country_treatment t, std_treatment st, std_cadre c 
            WHERE t.code=st.code AND st.cadre_code=c.code;SELECT * FROM country_treatment_dhis2;`,
        function (error, results, fields) {
            if (error) throw error;
            let resultsArr = [];

            results[0].forEach(tr => {

                let subRes = [];
                results[1].forEach(dc => {
                    if (tr.code == dc.treatment_code) {
                        subRes.push({
                            id: dc.id,
                            code: dc.dhis2_code,
                            name: dc.dhis2_name
                        })
                    }
                });

                resultsArr.push({
                    code: tr.code,
                    cadre_name: tr.cadre_name,
                    name_cust: tr.name_cust,
                    name: tr.name,
                    duration: tr.duration,
                    dhis2_codes: subRes
                })
            });
            //console.log(res);
            res.json(resultsArr);
        });
});


router.get('/treatments/:cadreCode', withAuth,function (req, res) {

    let cadreCode = req.params.cadreCode;

    let sql = "";

    if (cadreCode == "0") {
        sql = `SELECT t.code AS code,
                c.name AS cadre_name,t.name AS name,  t.duration AS duration 
                FROM  country_treatment t, std_treatment st, std_cadre c 
                WHERE t.code=st.code AND st.cadre_code=c.code`
    } else {
        sql = `SELECT t.code AS code,
        c.name AS cadre_name,t.name AS name,  t.duration AS duration 
        FROM  country_treatment t, std_treatment st, std_cadre c 
        WHERE t.code=st.code AND st.cadre_code=c.code AND t.cadre_code="${cadreCode}"`;
    }

    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/getTreatment/:cadreCode', withAuth,function (req, res) {

    let cadreCode = req.params.cadreCode;

    db.query(`SELECT ct.code AS code, ct.hris_code AS hris_code,
                ct.worktime AS worktime,ct.admin_task AS admin_task, 
                std.name AS name FROM country_cadre ct, std_cadre std 
                WHERE ct.code=std.code AND code="${cadreCode}"`, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
})

router.delete('/deleteTreatment/:code',withAuth, function (req, res) {

    let code = req.params.code;

    db.query(`DELETE FROM  country_treatment WHERE code="${code}"`, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.post('/uploadTreatments', withAuth,function (req, res) {

    if (!req.files) {
        return res.status(400).send('No files were uploaded');
    }

    //The name of the input field
    let file = req.files.file;

    let filename = 'country_treatment.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`, function (err) {
        if (err) {
            console.log("ERROR ", err);
            return res.status(500).send(err);
        }

        //res.status(200).send('File uploaded successfully');
        let sql = "";

        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`).to.array(function (data) {

            for (var index = 1; index < data.length; index++) {

                let code = data[index][0];

                let dhis2_code = data[index][1];

                let std_name = data[index][2];

                let customized_name = data[index][3];

                let std_cadre_code = data[index][4];

                let duration = data[index][6];

                sql += `INSERT INTO country_treatment(code,dhis2_code,cadre_code,name,duration) VALUES("${code}","${dhis2_code}","${std_cadre_code}","${std_name}","${customized_name}",${duration}) 
                            ON DUPLICATE KEY UPDATE dhis2_code="${dhis2_code}",cadre_code = "${std_cadre_code}",name="${std_name}"="${customized_name}", duration=${duration};`;
            }

            db.query(sql, function (error, results) {
                if (error) throw error;
                res.status(200).send('File uploaded successfully');
            });
        });
    });
})
module.exports = router;