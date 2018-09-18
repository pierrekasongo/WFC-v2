const sql = require('mysql');

let router = require('express').Router();

const db=require('../../dbconn');

router.post('/', (req, res) => {

    /* what req.body looks like:
        { facilityId: '8',
  cadres:
   { '1': { hours: 40, adminPercentage: 17 },
     '2': { hours: 43, adminPercentage: 15 } },
  treatments:
   { '1': true,
     '2': false,
     '3': true,
     '15': true,
     '16': true,
     '17': true,
     '18': true } }
    */
    let cadres=req.body.cadres;
    let treatmentIds =['1','2','3','4','5','6','7','8']; //Object.keys(req.body.treatments).filter(id => req.body.treatments[id]);
    let facilityId=req.body.facilityId.toString();
    let period=req.body.selectedPeriod.toString();
    console.log(period);
    
    // queries
    let treatmentsQuery = `SELECT Id, Ratio FROM treatments`;
    let patientCountQuery = `SELECT TreatmentId, SUM(Patients) AS PatientCount FROM dhis2
                                WHERE CONCAT(Year, Quarter)=ANY(SELECT DISTINCT CONCAT(Year, Quarter) FROM dhis2 WHERE FacilityId="`+facilityId+`" ORDER BY CONCAT(Year, Quarter) DESC)
                                    AND FacilityId="`+facilityId+`"
                                GROUP BY TreatmentId LIMIT 0,4`;
    let timePerTreatmentQuery = `SELECT TreatmentId, CadreId, MinutesPerPatient AS TreatmentTime FROM TreatmentSteps  GROUP BY TreatmentId, CadreId`;//Select only for selected cadres
    let facilityStaffCountQuery = `SELECT CadreId, COUNT(*) AS StaffCount FROM ihris
                                    WHERE  FacilityCode="`+facilityId+`"
                                    GROUP BY CadreId`;

    //new sql.Request()
       // .input('FacilityId', sql.Int, req.body.facilityId)
        db.query(`${treatmentsQuery}; ${patientCountQuery}; ${timePerTreatmentQuery}; ${facilityStaffCountQuery};`,function(error,results){

            let treatmentsQueryResult = results[0];

            let patientCountQueryResult = results[1];

            let facilityStaffCountQueryResult = results[3];

            // convert results from query into a dictionary from an array
            let patientsPerTreatment = {}
            patientCountQueryResult.forEach(row => {
                patientsPerTreatment[row['TreatmentId']] = row['PatientCount'];
            });

            let timePerTreatmentQueryResult = results[2];

            //console.log(timePerTreatmentQueryResult);

            // set to zero if treatment has no patients
            treatmentsQueryResult.forEach(row => {
                if (!patientsPerTreatment[row['Id']]) {
                    patientsPerTreatment[row['Id']] = 0
                }
            });

            let workersNeededPerTreatment = {};
            Object.keys(cadres).forEach(cadreId => {
                treatmentsQueryResult.forEach(treatmentRow => {
                    let treatmentId = treatmentRow['Id'];

                    let timePerPatient = timePerTreatmentQueryResult.filter(val =>
                        val['CadreId'] == cadreId && val['TreatmentId'] == treatmentId);
                    if (timePerPatient[0] == null) {
                        timePerPatient = 0;
                    } else {
                        timePerPatient = timePerPatient[0]['TreatmentTime'];
                    }

                    totalHoursForTreatment = (timePerPatient / 60) * patientsPerTreatment[treatmentId];


                    // input parameters
                    let cadreHours = cadres[cadreId].hours;
                    let cadreAdminPercentage = cadres[cadreId].adminPercentage;

                    let hoursAWeek = cadreHours * (1 - (cadreAdminPercentage / 100));
                    let hoursAYear = hoursAWeek * 52;

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
                treatmentIds.forEach(treatmentId =>
                    workersNeeded[cadreId] += workersNeededPerTreatment[cadreId][treatmentId]
                )
            });
            

            /******* calculate workforce pressure ***************/
            // step 1: normalize ratio values
            let ratioSum = 0;
            treatmentsQueryResult.forEach(row => ratioSum += row['Ratio']);
            let normalizedRatios = {};
            treatmentsQueryResult.forEach(row =>
                normalizedRatios[row['Id']] = row['Ratio'] / ratioSum
            );
            // step 2: determine current workforce dedicated to each treatment
            let workersPerTreatment = {};
            facilityStaffCountQueryResult.forEach(row => {
                workersPerTreatment[row['CadreId']] = {};
                Object.keys(normalizedRatios).forEach(treatmentId => {
                    workersPerTreatment[row['CadreId']][treatmentId] = row['StaffCount'] * normalizedRatios[treatmentId];
                });
            });
            
            // step 3: calculate pressure, but only for the selected treatments
            let pressure = {}
            let currentWorkers = {};
            Object.keys(workersPerTreatment).forEach(cadreId => {
                let workers = 0;
                
                treatmentIds.forEach(treatmentId => {
                    
                    workers += workersPerTreatment[cadreId][treatmentId];
                    
                });
                //workers=2;
                //currentWorkers[cadreId] = 2;
                currentWorkers[cadreId] = Number.parseFloat(workers).toFixed(2);
                
                pressure[cadreId] =Number.parseFloat(workers).toFixed(2) / Number.parseFloat(workersNeeded[cadreId]).toFixed(2);
            });

            //Current workers: suggested by Pierre; simply select the available workers for the cadre
            facilityStaffCountQueryResult.forEach(row => {

                currentWorkers[row['CadreId']] = row['StaffCount'];

                pressure[row['CadreId']] =Number.parseInt(row['StaffCount']) / Number.parseFloat(workersNeeded[row['CadreId']]).toFixed(2);
            });
            
            res.json({
                currentWorkers: currentWorkers,
                workersNeeded: workersNeeded,
                pressure: pressure
            });

            /*console.log(currentWorkers);
            console.log(workersNeeded);
            console.log(pressure);*/
        });
        /*db.then(result => {*/
            
            
        //}).catch(err => res.status(500).json(err));
});


module.exports = router;