const express = require('express');
const sql = require('mysql');
const db=require('../dbconn');
const path=require('path');
const stringify=require('csv-stringify');

const fs=require('fs');
const mime=require('mime')
let router = express.Router();

router.post('/treatments/:Treatment', (req, res) => {

    //console.log(req.body.ratio)

    var treatment=req.params.Treatment.toString();

    db.query(`INSERT INTO treatments (Treatment, Ratio) VALUES ("`+treatment+`", 1); 
                    SELECT * FROM treatments WHERE Id = LAST_INSERT_ID()`,function(error,results){
            if(error)throw error;

            res.json(results[1]);

    });
});

// update treatmnent info
router.patch('/treatments/:id', (req, res) => {
        /*new sql.Request()
        .input('Treatment', sql.NVarChar, req.body.treatment)
        .input('Ratio', sql.Float, req.body.ratio)
        .input('Id', sql.Int, req.params.id)*/
        db.query(`UPDATE treatments SET Treatment = @Treatment, Ratio = @Ratio
                    WHERE Id = @Id;
                SELECT * FROM treatments
                    WHERE Id = @Id`,function(error,results){
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

router.get('/treatments_cadres', function(req, res){
    
        db.query(`SELECT ts.Id, Treatment, MinutesPerPatient AS duration, c.Job_Cadre AS cadre FROM TreatmentSteps ts, Treatments t,
                    cadre c WHERE ts.TreatmentId = t.Id AND c.Id=ts.CadreId;`,function(error,results,fields){
                            if(error) throw error;
                            let treatments={};
                            results.forEach(row => {

                                treatments[row['Id']] = {
                                    id:row['Id'],
                                    treatment: row['Treatment'],
                                    cadre:row['cadre'],
                                    duration:row['duration']
                                };
                               
                            });
                            res.json(treatments);
                            //res.send(JSON.stringify({treatments}));
                            //res.json(treatments);
        });
});

router.post('/treatments_cadres/:duration', (req, res) => {

    //console.log(req.body.ratio)
    var cadreId=parseInt(req.body.cadreId.toString());
    var treatmentId=parseInt(req.body.treatmentId.toString())
    var duration=parseInt(req.params.duration.toString());

    db.query(`INSERT INTO treatmentsteps (TreatmentId, CadreId,MinutesPerPatient) VALUES (`+treatmentId+`,`+cadreId+`,`+duration+`); 
    SELECT t.Id, Treatment, MinutesPerPatient AS duration, c.Job_Cadre AS cadre FROM TreatmentSteps ts, Treatments t,
    cadre c WHERE ts.TreatmentId = t.Id AND c.Id=ts.CadreId AND ts.Id = LAST_INSERT_ID()`,function(error,results){
                if(error)throw error;
                let treatments;
                results[1].forEach(row => {
                    treatments = {
                        id:row['Id'],
                        treatment: row['Treatment'],
                        cadre:row['cadre'],
                        duration:row['duration']
                    };
                               
                });
                res.json(treatments);

        });
});

router.post('/write_csv/:id', (req, res) => {

    let selectedCadreId=parseInt(req.params.id.toString());

    let selectedCadre=req.body.selectedCadre.toString();

    let filePath=`${__dirname}`+path.sep+'uploads'+path.sep+'dhis2'+path.sep+`timeontreament.csv`;

   
    let data = [];
    let columns = {
        TreatmentId: 'TreatmentId',
        Treatment: 'Treatment',
        CadreId:'CadreId',
        Cadre:'Cadre',
        TimeByPatient:'TimeByPatient'
    };

    db.query(`SELECT Id, Treatment, Ratio FROM  Treatments;`,function(error,results){
        if(error) throw error;
        results.forEach(row => {
            data.push([row['Id'],row['Treatment'],selectedCadreId,selectedCadre,0]);
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
router.delete('/treatments_cadres/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

       db.query(`DELETE FROM treatmentsteps WHERE Id=`+id,function(error,results,fields){
                    if(error)res.sendStatus(500);//throw error;
                    res.json(results);
                    //res.send(JSON.stringify(results));

        });
});

router.get('/treatments', function(req, res){
    
    db.query(`SELECT Id, Treatment, Ratio FROM  Treatments;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
                        //res.send(JSON.stringify({treatments}));
                        //res.json(treatments);
    });
});

module.exports = router;