const sql = require('mysql');

let router = require('express').Router();

const db=require('../../dbconn');

/*
---------- get the data for a stacked bar chart together
---------- x-axis = will have the treatments
---------- y - axis = will have the time ( color stacks for cadres)
*/
router.get('/StackedBarcharts', function(req, res){

        db.query(`Select temp.Treatment as treatmentName, temp.Job_Cadre, SUM(temp.MinutesPerPatient) as totalTime 
                    from (select t.Treatment, c.Job_Cadre, tt.MinutesPerPatient, tt.Task
                    from treatments t, treatmentsteps ts, cadre c, timeontask tt
                    where ts.TreatmentId = t.Id AND ts.CadreId = c.Id AND ts.TaskId = tt.Id) AS temp
                    GROUP BY temp.Treatment, temp.Job_Cadre`,function(error,results,fields){

            if(error)throw error;

            //res.send(JSON.stringify(results));

            let data = {};

            results.forEach(row => {
                if (data[row['treatmentName']] == null) {
                    data[row['treatmentName']] = {
                        name: row['treatmentName']
                    };
                }

                let roundedMinutes = Math.round(row['totalTime'] * 100) / 100;
                data[row['treatmentName']][row['Job_Cadre']] = roundedMinutes;
            });

            data = Object.keys(data).map(name => data[name]);
            res.json(data);
            //res.send(JSON.stringify({data}));
        });
});



module.exports = router;