const sql = require('mysql');
const db = require('../dbconn');
var bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path');

const csv = require('csv');

const api_caller = require('./config');

const withAuth = require('./auth');

let router = require('express').Router();


let countryId = 52;

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

//var request=require('request');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
}).options('*', function (req, res, next) {
    res.end();
});

/************API***********/
router.post('/push',function(req,res){

    /*var data =[
        {
            "Region":"Haut katanga",
            "District":"Lubumbashi",
            "Facility_type_code":"100",
            "Facility_code":"0001",
            "Facility_name":"HGR Sendwe",
        }
    ]*/
    var data = req.body;

    var sql = ``;

    data.forEach(obj => {

        var region = obj["Region"];
        var district = obj["District"];
        var facility_type = obj["Facility_type_code"]
        var facility_code = obj["Facility_code"];
        var facility_name = obj["Facility_name"];
       
        sql += `DELETE FROM facility WHERE code="${facility_code}"  AND countryCode=${countryId};`;

        sql += `INSERT INTO facility (countryCode,facilityType,region,district,code,name)
                 VALUES(${countryId},${facility_type},"${region}","${district}","${code}","${facility_name}");`;
    })
    db.query(sql, function (error, results) {
        if (error) throw error;
        res.status(200).send('File uploaded successfully');
    });
})
/**********************END API ****************/


router.get('/count_facilities', (req, res) => {
    db.query('SELECT COUNT(id) AS nb FROM facility', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

//Update facility selected state
router.patch('/facilities/:id', (req, res) => {

    var id = parseInt(req.params.id.toString());

    var selected = parseInt(req.body.selected.toString());

    db.query(`UPDATE facilities SET selected =` + selected + ` WHERE id =` + id, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
//Facility type
router.get('/facilityTypes'/*,withAuth,*/, function(req, res){
    
    db.query(`SELECT * FROM  std_facility_type;`,function(error,results,fields){
        if(error) throw error;
        res.json(results);
    });
});

router.post('/insertType'/*,withAuth*/, (req, res) => {

    let code = req.body.code;

    let name=req.body.name;

    db.query(`INSERT INTO std_facility_type(code,name) 
            VALUES("${code}","${name}")`, 
        function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});

router.delete('/deleteType/:code',withAuth, function(req, res){

    let code=req.params.code; 

    db.query(`DELETE FROM  std_treatment WHERE facility_type="${code}";
                DELETE FROM  std_facility_type WHERE code="${code}";`,function(error,results,fields){
        if(error) throw error;
        res.status(200).send("Deleted successfully");
    });
});

router.patch('/editType', (req, res) => {

    let code = req.body.code;

    let value = req.body.value;

    let param=req.body.param;

    db.query(`UPDATE std_facility_type SET ${param} ="${value}" WHERE code ="${code}"`, function (error, results) {
        if (error) throw error;
        res.json(results);
    });

});
// get list of facilities
router.get('/facilities', (req, res) => {

    let sql = `SELECT fa.id as id, fa.code as code, fa.name as name, fa.region,fa.district,
    ft.code as facilityTypeCode, ft.name as facilityType FROM facility fa, std_facility_type ft 
    WHERE fa.facilityType = ft.code 
    AND fa.countryCode = ${countryId}`;

    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

router.get('/get_tree', (req, res) => {

    var sql = `SELECT DISTINCT fa.region as region FROM facility fa WHERE fa.countryCode = ${countryId}`;

    var tree = [];

    db.query(sql, function (error, regions, fields) {

        var obj = {}

        if (error) throw error;

        regions.forEach(rg =>{

            var region = rg.region;

            obj["label"] = region;
            obj["value"]=region;
            obj["code"]=0;

            sql = `SELECT DISTINCT fa.district as district FROM facility fa WHERE fa.region LIKE "${region}"`;

            db.query(sql, function (error, districts, fields) {

                if (error) throw error;
        
                districts.forEach(dis =>{

                    var district = dis.district;

                    var child =[];

                    var obj_dist={};

                    obj_dist["label"]=district;
                    obj_dist["value"]=district;
                    obj_dist["code"]=0;

                    //child.push({"label":district,"value":district});

                    sql = `SELECT  fa.id as id, fa.code as code, fa.name as name FROM facility fa WHERE fa.district LIKE "${district}"`;

                    db.query(sql, function (error, facilities, fields) {

                        if (error) throw error;
                        
                        var leaf = [];
                
                        facilities.forEach(fa =>{

                            leaf.push({"label":fa.name,"value":fa.id,"code":fa.code});

                            //leaf.push();
                        })
                        obj_dist["children"]=leaf;
                        child.push(obj_dist);
                        obj["children"]=child;

                        res.json(obj);
                    });

                })
                
            })
            
            //console.log(obj)
        //res.json(results);
        });
        //res.json(obj);
    });
})


router.post('/insert_facilities', (req,res) => {

    let sql=``;

    let selectedFacilities = req.body.selectedFacilities;

    selectedFacilities.forEach(fac => {
        sql+=`INSERT INTO facility(countryCode,code,name,region,district) 
                VALUES(${countryId},"${fac.id}","${fac.name}","${fac.region}","${fac.district}");`;
    });
    db.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})

router.post('/uploadFacilities',withAuth, function (req, res) {

    if (!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file = req.files.file;

    let filename = 'std_facilities.csv';

    file.mv(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`, function (err) {
        if (err)
            return res.status(500).send(err);
        let sql = "";

        var obj = csv();

        obj.from.path(`${__dirname}` + path.sep + 'uploads' + path.sep + 'metadata' + path.sep + `${filename}`).to.array(function (data) {
                
                for (var index = 1; index < data.length; index++) {

                    let region = data[index][0];

                    let district = data[index][1];

                    let facilityCode = data[index][2];

                    let facilityName=data[index][3];

                    let facilityType=data[index][4];

                    sql += `INSERT INTO facility(region,district,code,name,facilityType,countryCode
                             VALUES("${parentCode}","${parentName}","${facilityCode}","${facilityName}","${facilityType}",
                            ${countryId}) 
                            ON DUPLICATE KEY UPDATE name="${facilityName}",code="${facilityCode}",
                            region="${region}",district="${district}",facilityType="${facilityType}
                            WHERE countryId = ${countryId};`;
                }

                db.query(sql, function (error, results) {
                    if (error) throw error;
                    res.status(200).send('File uploaded successfully');;
                });
        });
    });
})

router.delete('/deleteFacility/:id', function (req, res) {

    let id = req.params.id;

    db.query(`DELETE FROM  facility WHERE id=${id}`, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send("Deleted successfully");
    });
});
module.exports = router;