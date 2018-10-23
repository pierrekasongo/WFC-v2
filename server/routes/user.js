const sql = require('mysql');
const db=require('../dbconn')

const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive');
const utilizationRoute = require('./user/utilization');

let router = require('express').Router();

// get list of facilities
router.get('/facilities',(req,res) => {
    db.query('SELECT * FROM facilities WHERE selected=1',function(error,results,fields){
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

    console.log(id+" "+selected);

    db.query(`UPDATE facilities SET selected =`+selected+` WHERE Id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
    
});
//Update hours per week for a cadre
router.patch('/cadre/hours/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.hours.toString());

    db.query(`UPDATE cadre SET Hours_Per_Week =`+value+` WHERE Id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

//Update hours per week for a cadre
router.patch('/cadre/admin_work/:id', (req, res) => {

    var id=parseInt(req.params.id.toString());

    var value=parseInt(req.body.admin_task.toString());

    db.query(`UPDATE cadre SET Admin_Task =`+value+` WHERE Id =`+id,function(error,results){
                    if(error)throw error;
                    res.json(results);
    });
});

// get list of cadres
router.get('/cadres', (req, res) => {
        db.query('SELECT Id AS id,Job_Cadre AS name,Hours_Per_Week AS Hours,Admin_Task AS AdminTask FROM cadre',function(error,results,fields){
            if(error) throw error;
            res.json(results);
        });
});

// get list of available workforce by cadre and facility
router.get('/workforce', (req, res) => {
    /*db.query('SELECT ih.Id AS id,ih.Surname AS surname,ih.First_Name AS firstname,'+
    'fa.Name AS facility,ca.Job_Cadre AS cadre  FROM ihris ih,cadre ca,facilities fa WHERE ih.FacilityId=fa.Id AND ih.CadreId=ca.Id'*/
    db.query('SELECT ih.Id AS id,ih.Surname AS surname,ih.First_Name AS firstname,'+
    'fa.Name AS facility,ca.Job_Cadre AS cadre  FROM ihris ih,cadre ca,facilities fa WHERE ih.FacilityCode=fa.FacilityCode AND ih.CadreId=ca.Id',function(error,results,fields){
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

    db.query(`UPDATE ihris SET FacilityId =`+facilityId+` WHERE Id =`+personId,function(error,results){
            if(error)throw error;
            res.json(results);
    });                                                                                                                                                    
});
// get list of available workforce without caring about facility
router.get('/all_workforce', (req, res) => {
    db.query('SELECT Id AS id,FacilityId AS facilityId, FacilityCode AS facilityCode FROM ihris',function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});
//get list of treatments
router.get('/treatments', (req, res) => {
        db.query(`SELECT Id AS id, Treatment AS treatment FROM treatments`,function(error,results,fields){
            if(error) throw error;
            res.json(results);
        });
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);
router.use('/utilization', utilizationRoute);

module.exports = router;