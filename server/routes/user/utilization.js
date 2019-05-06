const sql = require('mysql');

let router = require('express').Router();

const db=require('../../dbconn');

/*
---------- get the data for a stacked bar chart together
---------- x-axis = will have the treatments
---------- y - axis = will have the time ( color stacks for cadres)
*/
router.get('/StackedBarcharts', function(req, res){

        db.query(`Select temp.activityName as treatmentName, temp.cadreName, SUM(temp.minutesPerPatient) as totalTime 
                    from (select t.activityName, c.cadreName, tt.minutesPerPatient 
                    from activities t, cadre c, activity_time tt) AS temp
                    GROUP BY temp.activityName, temp.cadreName`,function(error,results,fields){

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
                data[row['treatmentName']][row['cadreName']] = roundedMinutes;
            });

            data = Object.keys(data).map(name => data[name]);
            res.json(data);
            //res.send(JSON.stringify({data}));
        });
});



module.exports = router;