const sql = require('mysql');
const db = require('../dbconn')
const fileUpload = require('express-fileupload');
const path = require('path');
const csv = require('csv');

const XLSX = require('xlsx');
const uniqueFilename = require('unique-filename');
const os = require('os');

const withAuth = require('../middleware/is-auth')


let config = require('./configuration.js');

let router = require('express').Router();

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

let countryId = 52;


/***************API****************/

router.post('/push',withAuth,function(req,res){

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
        if (error) {
            res.status(500).send(error)
        }
        res.status(200).json(results);
    });

})

/************** END API **************/

router.patch('/editHR', withAuth,(req, res) => {

    let id = req.body.id;

    let value = req.body.value;

    let param = req.body.param;

    db.query(`UPDATE staff SET ${param} ="${value}" WHERE id =${id}`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
// get list of available workforce by cadre and facility
router.get('/workforce/:countryId',withAuth, (req, res) => {

    var countryId = req.params.countryId;

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
            fa.name AS facility,ca.name AS cadre  FROM 
                staff s,std_cadre ca, facility fa WHERE 
                s.facilityCode=fa.code AND s.cadreCode=ca.code and ca.countryId=${countryId}`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

// get list of available workforce without caring about facility
router.get('/all_workforce', withAuth,(req, res) => {
    db.query('SELECT id AS id,facilityId AS facilityId, facilityCode AS facilityCode FROM staff', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/count_staffs/:countryId', withAuth,(req, res) => {
    db.query(`SELECT SUM('staffCount') AS nb FROM staff st,std_cadre ca WHERE 
        st.cadreCode=ca.code AND ca.countryId=${countryId}`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});
//get count staff per cadre
router.get('/staff_per_cadre',withAuth, (req, res) => {

    db.query(`SELECT s.id AS id,s.staffCount AS staff,
        fa.name AS facility,cstd.name AS cadre  FROM 
        staff s,country_cadre ca,std_cadre cstd, facility fa WHERE 
        s.facilityCode=fa.code AND s.cadreCode=ca.std_code 
        AND ca.std_code=cstd.code GROUP BY s.cadreCode`, function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

router.delete('/deleteWorkforce/:id', withAuth,function (req, res) {

    let id = req.params.id;

    db.query(`DELETE FROM  staff WHERE id=${id}`, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.get('/workforce/:cadre_code',withAuth, (req, res) => {

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


router.post('/uploadHR', withAuth,function (req, res) {

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

var calculationResults=[];

router.post('/workload', withAuth, (req, res) => {

    calculationResults=[];

    let cadres = req.body.selectedCadres;

    let holidays = req.body.holidays;

    let period = req.body.selectedPeriod.toString();

    let facilityId = 0;//req.params.code.toString();

    let facilities = req.body.selectedFacilities;

    //Getting cadre ids 
    let cadreIds = [];

    //Getting facility ids
    let facilityIds = [];

    let i = 0;

    let obj={};

    Object.keys(cadres).forEach(cadreId => {
        cadreIds[i] = cadreId;
        i++;
    });

    let size=Object.keys(facilities).length;

    let count=0;

    let expecting=Object.keys(facilities).length;

    Object.keys(facilities).forEach(id => {

        count++;

        facilityId = facilities[id].id;

        process(facilityId,facilities,cadreIds,cadres,period,holidays,
            function(obj) {
                calculationResults.push(obj);
                if(--expecting === 0){
                    //console.log(calculationResults);
                    res.json(calculationResults);
                }
            });
    });

})


var process=function(facilityId,facilities,cadreIds,cadres,period,holidays, callback){
    //PROCESS
    let treatmentIds = [];

    let obj={};

    let facilityCode=facilities[facilityId].code;

    let CAF = 0;

    let publicHolidays=holidays;

    // queries
    //let concernedTreatmentsQuery= `SELECT id, ratio FROM activities WHERE `;
    let treatmentsQuery = `SELECT code AS id,ratio FROM country_treatment WHERE cadre_code IN(?)`;
    //let treatmentsQuery = `SELECT id, ratio FROM activities WHERE id IN (SELECT activityId FROM activity_time WHERE cadreId IN(?) )`;
    let patientCountQuery = `SELECT activityCode  AS id, SUM(caseCount) AS PatientCount FROM activity_stats
                           WHERE year="${period}" AND facilityCode="${facilityCode}" GROUP BY activityCode`;

    //let timePerTreatmentQuery = `SELECT activityId, cadreId, minutesPerPatient AS TreatmentTime FROM 
                           //activity_time WHERE cadreId IN(?) GROUP BY activityId, cadreId`;

    let timePerTreatmentQuery = `SELECT code AS activityId, cadre_code AS cadreId, duration AS TreatmentTime FROM 
                                    country_treatment WHERE cadre_code IN(?)`;//Select only for selected cadres
    
    let facilityStaffCountQuery = `SELECT id, cadreCode, staffCount AS StaffCount FROM staff
                                    WHERE  facilityCode="${facilityCode}" AND cadreCode IN(?)`;
    

    db.query(`${treatmentsQuery}; ${patientCountQuery}; ${timePerTreatmentQuery}; ${facilityStaffCountQuery};`, [cadreIds, cadreIds,cadreIds],
        function (error,results) {

            let treatmentsQueryResult = results[0];

            let patientCountQueryResult = results[1];

            let facilityStaffCountQueryResult = results[3];

            // convert results from query into a dictionary from an array
            let patientsPerTreatment = {};

            patientCountQueryResult.forEach(row => {
                patientsPerTreatment[row['id']] = row['PatientCount'];

                //treatmentIds[row['id']] = row['id'];
                treatmentIds.push(row['id']);
            });

            let timePerTreatmentQueryResult = results[2];

            // set to zero if treatment has no patients
            treatmentsQueryResult.forEach(row => {
                if (!patientsPerTreatment[row['id']]) {
                    patientsPerTreatment[row['id']] = 0
                }
            });

            let workersNeededPerTreatment = {};

            Object.keys(cadres).forEach(cadreId => {

                treatmentsQueryResult.forEach(treatmentRow => {

                    let treatmentId = treatmentRow['id'];

                    let timePerPatient = timePerTreatmentQueryResult.filter(val =>
                        val['cadreId'] == cadreId && val['activityId'] == treatmentId);

                    if (timePerPatient[0] == null) {
                        timePerPatient = 0;
                    } else {
                        timePerPatient = timePerPatient[0]['TreatmentTime'];
                    }

                    //timePerPatient = timePerPatient[0]['TreatmentTime'];

                    totalHoursForTreatment = (timePerPatient / 60) * patientsPerTreatment[treatmentId];

                    // input parameters
                    //let cadreHours = cadres[cadreId].hours;

                    let workHours = cadres[cadreId].hours;

                    let workDays = cadres[cadreId].days;
                    let weeklyWorkHours = workHours * workDays;

                    let cadreAdminPercentage = cadres[cadreId].adminPercentage;

                    
                    //Non working days
                    let holidays = parseInt(publicHolidays);

                    let annualLeave = parseInt(cadres[cadreId].annualLeave);

                    let sickLeave = parseInt(cadres[cadreId].sickLeave);

                    let otherLeave = parseInt(cadres[cadreId].otherLeave);

                    let nonWorkingHours = (holidays + annualLeave + sickLeave + otherLeave) * workHours;
                    //End non working days

                    CAF = 1 / (1 - (cadreAdminPercentage / 100));

                    //let hoursAWeek = weeklyWorkHours * (1 - (cadreAdminPercentage / 100));

                    //let hoursAYear = hoursAWeek * 52;

                    let hoursAYear = (weeklyWorkHours * 52) - nonWorkingHours;
      
                    if (workersNeededPerTreatment[cadreId] == null) {

                        workersNeededPerTreatment[cadreId] = {};
                    }
                    workersNeededPerTreatment[cadreId][treatmentId] = totalHoursForTreatment / hoursAYear;

                });
            });

            // sum workers needed for only selected treatments
            let workersNeeded = {};

            Object.keys(workersNeededPerTreatment).forEach(cadreId => {

                workersNeeded[cadreId] = 0;

                treatmentIds.forEach(treatmentId =>{
                    //let cadreCode=`"${cadreId}"`;
                    //let treatmentCode=`"${treatmentId}"`;
                    workersNeeded[cadreId] += workersNeededPerTreatment[cadreId][treatmentId];

                })
                workersNeeded[cadreId] = workersNeeded[cadreId] * CAF;
            });

            /******* calculate workforce pressure ***************/
            // step 1: normalize ratio values
            let ratioSum = 0;

            treatmentsQueryResult.forEach(row => ratioSum += row['ratio']);

            let normalizedRatios = {};

            treatmentsQueryResult.forEach(row =>

                normalizedRatios[row['id']] = row['ratio'] / ratioSum
            );
            // step 2: determine current workforce dedicated to each treatment
            let workersPerTreatment = {};

            facilityStaffCountQueryResult.forEach(row => {

                workersPerTreatment[row['cadreCode']] = {};

                Object.keys(normalizedRatios).forEach(treatmentId => {

                    workersPerTreatment[row['cadreCode']][treatmentId] = row['StaffCount'] * normalizedRatios[treatmentId];
                });
            });
            
            // step 3: calculate pressure, but only for the selected treatments
            let pressure = {};

            let currentWorkers = {};

            Object.keys(workersPerTreatment).forEach(cadreId => {

                let workers = 0;

                treatmentIds.forEach(treatmentId => {
                    workers += workersPerTreatment[cadreId][treatmentId];
                });
                //workers=2;
                //currentWorkers[cadreId] = 2;
                currentWorkers[cadreId] = parseInt(workers);

                pressure[cadreId] = Number.parseFloat(workers).toFixed(2) / Number.parseFloat(workersNeeded[cadreId]).toFixed(2);
            });

            //Current workers: suggested by Pierre; simply select the available workers for the cadre
            facilityStaffCountQueryResult.forEach(row => {

                currentWorkers[row['cadreCode']] = row['StaffCount'];

                pressure[row['cadreCode']] = Number.parseInt(row['StaffCount']) / Number.parseFloat(workersNeeded[row['cadreCode']]).toFixed(2);
            });

            obj = {
                facilityId: facilityId,
                facility: facilities[facilityId].name,
                currentWorkers: currentWorkers,
                workersNeeded: workersNeeded,
                pressure: pressure
            };
            callback(obj);
            
        });//END QUERY CALL BACK 
}

// analytics
//router.use('/workforce', workforceRoute);
/*router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);*/

module.exports = router;