const sql = require('mysql');
const db = require('../dbconn')
const fileUpload = require('express-fileupload');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const csv = require('csv');
const http = require('http');

const request = require('request');
const progress = require('request-progress');

let router = require('express').Router();
var config = require('./config');

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

router.get('/download_cadres', function (req, res) {

    var name = config.ihris.cadre_report_name;

    var url = config.ihris.server + name;

    var file = __dirname + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + name;

    progress(request(url), {

    })
        .on('progress', function (state) {
            console.log('progress', state);
        })
        .on('end', function () {

            console.log("Download completed");
            //res.send('Done');

            var obj = csv();

            let sql = "";

            obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${name}`).to.array(
                function (data) {

                    sql = `TRUNCATE cadre;`;

                    for (var index = 2; index < data.length - 1; index++) {//index starts by 2 to length-1 to avoid <table> header and footer

                        let cadre_code = data[index][0];

                        let cadre_id = cadre_code.split("|")[1];

                        let cadre_name = data[index][1];

                        sql += `INSERT INTO cadre (id,cadreName,hoursPerWeek,adminTask) VALUES(` + cadre_id + `,"` + cadre_name + `",40,0);`
                    }
                    db.query(sql, function (error, results) {
                        if (error) throw error;
                        res.send("Done");
                    });
                });

        })
        .pipe(fs.createWriteStream(file));
});

router.get('/download_hr', function (req, res) {

    var name = config.ihris.hr_report_name;

    var url = config.ihris.server + name;

    var file = __dirname + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + name;

    progress(request(url), {

    })
        .on('progress', function (state) {

        })
        .on('end', function () {
            console.log("Download completed");
            let sql = "";

            var obj = csv();

            obj.from.path(file).to.array(function (data) {

                sql = `TRUNCATE ihris;`;

                for (var index = 2; index < data.length - 1; index++) {//index starts by 2 to length-1 to avoid <table> header and footer

                    let fa_id = data[index][0];

                    let facility_id = fa_id.split("|")[1];

                    let facility_code = data[index][1];

                    let cad_id = data[index][2];

                    let cadre_id = cad_id.split("|")[1];

                    let staffCount = data[index][3];

                    sql += `INSERT INTO ihris (facilityId,facilityCode,cadreId,staffCount) VALUES(`
                        + facility_id + `,"` + facility_code + `",` + cadre_id + `,` + staffCount + `);`
                }
                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.send("Done");
                });
            });

        })
        .pipe(fs.createWriteStream(file));



});



router.post('/upload', function (req, res) {

    if (!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file = req.files.file;

    //let filename=file.name;

    let type = req.body.type;

    let filename = (type == 'hr') ? 'workforce.csv' : 'cadres.csv';

    //Use the mv() method to place the file somewhere on the server
    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${filename}`, function (err) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send('File uploaded successfully');
        //return res.status(200).send('File uploaded successfully');
    });

    let sql = "";

    let countryId = 52;

    if (type == 'hr') {
        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${filename}`).to.array(function (data) {

            sql = `TRUNCATE ihris;`;

            for (var index = 1; index < data.length; index++) {

                //persons.push(new person(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4]))
                let person_code = data[index][0];

                let person_id = person_code.split("|")[1];

                let fac_id = data[index][3];

                let facility_id = fac_id.split("|")[1];

                let facility_code = data[index][4];

                let cadre_code = data[index][5];

                let cadre_id = cadre_code.split("|")[1];

                let staffCount = 0;

                sql += `INSERT INTO staff (id,facilityId,facilityCode,cadreId,staffCount) VALUES(`
                    + facility_id + `,"` + facility_code + `",` + cadre_id + `,` + staffCount + `);`
            }
            db.query(sql, function (error, results) {
                if (error) throw error;
                res.status(200);
            });
        });
    } else {
        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'ihris' + path.sep + `${filename}`).to.array(function (data) {
            
            sql = `DELETE FROM cadre WHERE countryId=`+countryId+`;`;

            for (var index = 1; index < data.length; index++) {

                let code=data[index][0];

                let id=0;

                if(code.includes("|")){
                    id = code.split("|")[1];
                }else{
                    id=code;
                }
                let cadreName = data[index][1];

                sql += `INSERT INTO cadre (id,countryId,cadreName) VALUES(` + id + `,` + countryId + `,"` + cadreName + `");`;
            }
            console.log(sql);
            /*db.query(sql,function(error,results){
                if(error)throw error;
                res.status(200)
                            
            });*/
        });
    }

})

module.exports = router;