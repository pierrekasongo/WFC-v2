const sql = require('mysql');
const db=require('../dbconn')

const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive');
const utilizationRoute = require('./user/utilization');

let router = require('express').Router();

router.post('/login', function(req, res){

    var login=req.body.login.toString();
    var password=req.body.password.toString();
    
    db.query(`SELECT * FROM users WHERE login ="`+login+`"  AND password ="`+password+`";` ,function(error,results,fields){
                        if(error) throw error;
                        let user={};
                        results.forEach(row => {

                            user[row['id']] = {
                                id:row['id'],
                                login: row['login'],
                                name:row['name'],
                                country_id:row['country_id'],
                                last_login:row['last_login']
                            };
                           
                        });
                        res.json(user);
    });
});
// get list of facilities
router.get('/facilities',(req,res) => {
    db.query('SELECT * FROM facilities WHERE selected=1',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});

router.get('/facility_tree', function(req, res){

    db.query(`SELECT DISTINCT(regionName) AS region FROM facilities WHERE selected=1;`,function(error,results,fields){
                        if(error) throw error;
                        let tree={};
                        let region="";
                        let district="";
                        results.forEach(row => {

                            region=row['region'];

                            db.query(`SELECT DISTINCT(districtName) AS district FROM facilities 
                            WHERE regionName='`+row['region']+`' AND selected=1;`,function(err,res,fld){
                                if(err) throw err;

                                res.forEach(r => {
                                    
                                    district=r['district'];

                                    db.query(`SELECT id,facilityCode,facilityName FROM facilities 
                                    WHERE districtName='`+r['district']+`' AND selected=1;`,function(er,rs,fd){
                                        if(er) throw er;
                                        rs.forEach(rec => {

                                            facilityName=rec['facilityName'];

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

router.get('/count_facilities',(req,res) => {
    db.query('SELECT COUNT(id) AS nb FROM facilities',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});
// get list of selected facilities
router.get('/selected_facilities',(req,res) => {
    db.query('SELECT * FROM facilities WHERE selected=1',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});

//Update facility selected state
router.patch('/facilities/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

    var selected=parseInt(req.body.selected.toString());

    db.query(`UPDATE facilities SET selected =`+selected+` WHERE id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
    
});
//Update hours per week for a cadre
router.patch('/cadre/hours/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.hours.toString());

    db.query(`UPDATE cadre SET hoursPerWeek =`+value+` WHERE id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

//Update hours per week for a cadre
router.patch('/cadre/admin_work/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.admin_task.toString());

    db.query(`UPDATE cadre SET adminTask =`+value+` WHERE od =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

// get list of cadres
router.get('/cadres', (req, res) => {
        db.query('SELECT id AS id,cadreName AS name,hoursPerWeek AS Hours,adminTask AS AdminTask FROM cadre',function(error,results,fields){
            if(error) throw error;
            res.json(results);
        });
});

router.get('/count_cadres',(req,res) => {
    db.query('SELECT COUNT(id) AS nb FROM cadre',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});

// get list of available workforce by cadre and facility
router.get('/workforce', (req, res) => {
    /*db.query('SELECT ih.Id AS id,ih.Surname AS surname,ih.First_Name AS firstname,'+
    'fa.Name AS facility,ca.Job_Cadre AS cadre  FROM ihris ih,cadre ca,facilities fa WHERE ih.FacilityId=fa.Id AND ih.CadreId=ca.Id'*/
    db.query('SELECT s.id AS id,s.staffCount AS staff,'+
    'fa.facilityName AS facility,ca.cadreName AS cadre  FROM staff s,cadre ca,facilities fa WHERE s.facilityCode=fa.FacilityCode AND s.cadreId=ca.id',function(error,results,fields){
        if(error) throw error;
        res.json(results);
        /*setTimeout( function() {
            res.json(results);
        }, 10000 );*/
    });
});
//Update hours per week for a cadre
router.patch('/workforce/:personId', (req, res) => {

    var personId=parseInt(req.params.personId.toString());

    var facilityId=parseInt(req.body.facilityId.toString());

    console.log("person "+personId+" facilityId "+facilityId);

    db.query(`UPDATE staff SET facilityId =`+facilityId+` WHERE id =`+personId,function(error,results){
            if(error)throw error;
            res.json(results);
    });                                                                                                                                                    
});
// get list of available workforce without caring about facility
router.get('/all_workforce', (req, res) => {
    db.query('SELECT id AS id,facilityId AS facilityId, facilityCode AS facilityCode FROM staff',function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.get('/count_staffs',(req,res) => {
    db.query('SELECT SUM(`staffCount`) AS nb FROM staff',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});
//get count staff per cadre
router.get('/staff_per_cadre',(req,res) => {
    db.query('SELECT c.cadreName AS cadre, SUM(`staffCount`) AS nb FROM staff st,cadre c WHERE st.cadreId=c.id GROUP BY cadreId',function(error,results,fields){
        if(error) throw error;                        
        res.json(results);
    });
});
//get list of treatments
router.get('/activities', (req, res) => {
        db.query(`SELECT id AS id, activityName AS activityName FROM activities`,function(error,results,fields){
            if(error) throw error;
            res.json(results);
        });
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);

module.exports = router;