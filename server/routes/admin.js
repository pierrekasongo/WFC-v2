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

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

router.post('/activities/:activity',withAuth, (req, res) => {

    //console.log(req.body.ratio)

    let activity=req.params.activity.toString();

    let countryId=0;

    let activityName="";

    let code="";

    db.query(`INSERT INTO activities (countryId, activityName,code,ratio) VALUES (`+countryId+`,"`+activityName+`","`+code+`" 1); 
                    SELECT * FROM activities WHERE id = LAST_INSERT_ID()`,function(error,results){
            if(error)throw error;

            res.json(results[1]);

    });
});


// update treatmnent info
router.patch('/activities/:id',withAuth, (req, res) => {
        /*new sql.Request()
        .input('Treatment', sql.NVarChar, req.body.treatment)
        .input('Ratio', sql.Float, req.body.ratio)
        .input('Id', sql.Int, req.params.id)*/
        db.query(`UPDATE activities SET activityName = @Treatment, ratio = @Ratio
                    WHERE id = @Id;
                SELECT * FROM activities
                    WHERE id = @Id`,function(error,results){
                        if(error)throw error;
                        res.json(results);

                        let tagwords={};

                        results.forEach(row => {
                            if (tagwords[row['tagword']] == null) {
                                tagwords[row['tagword']] = [];
                            }
                            tagwords[row['tagword']].push(row['indicator']);
                        });
                    })
        /*.then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500))*/
});

router.get('/activities_cadres',withAuth, function(req, res){
    
        db.query(`SELECT t.id AS treatmentId, at.id, activityName, minutesPerPatient AS duration,
                     c.cadreName AS cadre,c.id AS cadreId FROM activity_time at, activities t,
                    cadre c WHERE at.activityId = t.id AND c.id=at.cadreId;`,function(error,results,fields){
                            if(error) throw error;
                            let treatments={};
                            results.forEach(row => {

                                treatments[row['id']] = {
                                    id:row['id'],
                                    treatment: row['activityName'],
                                    treatmentId:row['treatmentId'],
                                    cadre:row['cadre'],
                                    cadreId:row['cadreId'],
                                    duration:row['duration']
                                };
                               
                            });
                            res.json(treatments);
                            //res.send(JSON.stringify({treatments}));
                            //res.json(treatments);
        });
});

router.get('/activities_stats',withAuth, function(req, res){

    let facilityCode=req.query.facilityCode.split("|")[0];

    let facilityId=req.query.facilityCode.split("|")[1];

    let cadreId=req.query.cadreId.toString();

    let period=req.query.period.toString();

    console.log(period+" "+facilityId+" "+facilityCode+" "+cadreId);//return;
    
    db.query(`SELECT st.id AS id,st.facilityId, st.year AS year,SUM(st.caseCount) AS caseCount,act.activityName AS activity  
                 FROM activity_stats st, activities act WHERE st.activityId = act.id AND  facilityId="`+facilityCode+`" AND year="`+period+`" AND cadreId=`+cadreId,function(error,results,fields){
                    if(error) throw error;
                        let treatments={};
                        results.forEach(row => {

                            treatments[row['id']] = {
                                id:row['id'],
                                treatment: row['activity'],
                                year: row['year'],
                                caseCount:row['caseCount']
                            };
                           
                        });
                        res.json(treatments);
                        //res.send(JSON.stringify({treatments}));
                        //res.json(treatments);
    });
});

router.post('/activities_cadres/:duration',withAuth, (req, res) => {

    var cadreId=parseInt(req.body.cadreId.toString());
    var activityId=parseInt(req.body.treatmentId.toString())
    var duration=parseInt(req.params.duration.toString());

    var countryId=52;
    
    db.query(`INSERT INTO activity_time (countryId, activityId,cadreId,minutesPerPatient) 
    VALUES (`+countryId+`,`+activityId+`,`+cadreId+`,`+duration+`); 
    SELECT t.id, t.activityName, minutesPerPatient AS duration, c.cadreName AS cadre FROM activity_time ts, activities t,
    cadre c WHERE ts.activityId = t.id AND c.id=ts.cadreId`,function(error,results){
                if(error)throw error;
                let treatments;
                results[1].forEach(row => {
                    treatments = {
                        id:row['id'],
                        treatment: row['activityName'],
                        cadre:row['cadre'],
                        duration:row['duration']
                    };
                               
                });
                res.json(treatments);

        });
});

router.patch('/activity_duration/:id',withAuth, (req, res) => {

    var id = parseInt(req.params.id.toString());

    var value = parseInt(req.body.value.toString());

    db.query(`UPDATE activity_time SET minutesPerPatient =` + value + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.post('/write_csv/:id',withAuth, (req, res) => {

    let selectedCadreId=parseInt(req.params.id.toString());

    let selectedCadre=req.body.selectedCadre.toString();

    let filePath=`${__dirname}`+path.sep+'uploads'+path.sep+'dhis2'+path.sep+`timeontreament.csv`;

   
    let data = [];
    let columns = {
        activityId: 'activityId',
        activityName: 'activityName',
        cadreId:'cadreId',
        cadre:'cadre',
        timeByPatient:'timeByPatient'
    };

    db.query(`SELECT id, activity, ratio FROM  activities;`,function(error,results){
        if(error) throw error;
        results.forEach(row => {
            data.push([row['id'],row['activity'],selectedCadreId,selectedCadre,0]);
            //console.log([row['Id']+" "+row['Treatment']+" "+selectedCadreId+" "+selectedCadre]);
            /*treatments = {
                id:row['Id'],
                treatment: row['Treatment'],
                cadre:row['cadre'],
                duration:row['duration']
            };*/
        });
        stringify(data, { header: true, columns: columns }, (err, output) => {
            if (err) throw err;
            fs.writeFile(filePath, output, (err) => {
                if (err) throw err;
                
                
            });
        });                  
    });

    /*for (var i = 0; i < 10; i++) {
        data.push([i, 'Name ' + i]);
    }*/
  
    var filename = path.basename(filePath);

    var mimetype = mime.lookup(filePath);
  
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);

    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(filePath);

    filestream.pipe(res);

    //res.send(filePath);

});

// delete treatment
router.delete('/activities_cadres/:id',withAuth, (req, res) => {

    var id=parseInt(req.params.id.toString());

       db.query(`DELETE FROM activity_time WHERE id=`+id,function(error,results,fields){
                    if(error)res.sendStatus(500);//throw error;
                    res.json(results);
                    //res.send(JSON.stringify(results));

        });
});

router.get('/activities_cadres/:cadreId',withAuth, (req, res) => {

    var cadreId=parseInt(req.params.cadreId);

    db.query(`SELECT at.activityId as activityId, act.activityName as activityName, 
                at.cadreId as cadreId, c.cadreName as cadreName, at.minutesPerPatient as duration FROM 
                activity_time at, activities act, cadre c WHERE 
                at.activityId=act.id AND at.cadreId=c.id AND 
                cadreId=${cadreId}`,function(error,results,fields){
        if(error)res.sendStatus(500);
        res.json(results);
    });
});

router.get('/activities',withAuth, function(req, res){
    
    db.query(`SELECT id, activityName, ratio FROM  activities;`,function(error,results,fields){
    //db.query(`SELECT activityName FROM  activities;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
                        //res.send(JSON.stringify({treatments}));
                        //res.json(treatments);
    });
});

router.get('/count_activities',withAuth, function(req, res){
    
    db.query(`SELECT COUNT(id) AS nb FROM  activities;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
                        //res.send(JSON.stringify({treatments}));
                        //res.json(treatments);
    });
});

router.post('/upload_activity_time',withAuth, function (req, res) {

    let countryId = 52;

    if (!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file = req.files.file;

    let filename = 'time_on_treatment.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'dhis2' + path.sep + `${filename}`, function (err) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send('File uploaded successfully');
    });

    let sql = "";

    var obj = csv();

    obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'dhis2' + path.sep + `${filename}`).to.array(function (data) {

            for (var index = 1; index < data.length; index++) {

                let cadreId = data[index][0];

                let activityId = data[index][2];

                let duration = data[index][4];

                sql += `UPDATE activity_time SET minutesPerPatient=${duration} WHERE cadreId=${cadreId} 
                        AND activityId=${activityId} AND countryId=${countryId};`;
            }

            /*db.query(sql, function (error, results) {
                if (error) throw error;
                res.status(200);
            });*/
    });

})

module.exports = router;