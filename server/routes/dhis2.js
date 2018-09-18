const sql = require('mysql');
const db=require('../dbconn');
var bodyParser=require("body-parser");
const fileUpload=require('express-fileupload');
const path=require('path');

const csv=require('csv');

const api_caller=require('./config');

let router = require('express').Router();
let tryparse=require('tryparse');

router.use(fileUpload(/*limits: { fileSize: 50 * 1024 * 1024 },*/));

//var request=require('request');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
}).options('*', function (req, res, next) {
    res.end();
});

router.post('/upload',function(req,res){

    if(!req.files)
        return res.status(400).send('No files were uploaded');
    //The name of the input field
    let file=req.files.file;

    //let filename=file.name;

    let type=req.body.type;

    let filename=(type=='fac')?'facilities.csv':'services.csv';

    //Use the mv() method to place the file somewhere on the server
    file.mv(`${__dirname}`+path.sep+'uploads'+path.sep+'dhis2'+path.sep+`${filename}`,function(err){
        if(err)
            return res.status(500).send(err);
        res.status(200).send('File uploaded successfully');
        //return res.status(200).send('File uploaded successfully');
    });

    let sql="";

    if(type=='fac'){

        var obj=csv();

        obj.from.path(`${__dirname}`+path.sep+'uploads'+path.sep+'dhis2'+path.sep+`${filename}`).to.array(function (data) {
            /*for (var index = 0; index < data.length; index++) {
                facilities.push(new facility(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4]));
            }*/
            sql=`TRUNCATE facilities;`;

            for (var index = 1; index < data.length; index++) {

                let id=data[index][0];

                let region=data[index][1];

                let district=data[index][2];

                let facility_code=data[index][3];

                let facility_name=data[index][4];

                sql+=`INSERT INTO facilities (Id,regionName,districtName,FacilityCode,Name) VALUES(`
                +id+`,"`+region+`","`+district+`","`+facility_code+`","`+facility_name+`");`
            }

            db.query(sql,function(error,results){
                if(error)throw error;
                res.status(200);                     
            });


        });
    }else{//Service data
        var obj=csv();
       
        obj.from.path(`${__dirname}`+path.sep+'uploads'+path.sep+'dhis2'+path.sep+`${filename}`).to.array(function (data) {

            sql=`TRUNCATE dhis2;`;

            for (var index = 1; index < data.length; index++) {

                let facilityId=data[index][0];

                let year=data[index][1];

                let treatmentId=data[index][2];

                let Patients=data[index][3];

                sql+=`INSERT INTO dhis2 (FacilityId,Quarter,Year,TreatmentId,Patients) VALUES("`
                +facilityId+`","1","`+year+`",`+treatmentId+`,`+Patients+`);`

            }
            //console.log(sql);
            db.query(sql,function(error,results){
                if(error)throw error;
                res.status(200);
            })
        });
    }
})

router.get('/import_facilities_from_dhis2', function (req, res) {
    
    var api_url = api_caller.dhis2.api_url+"sqlViews/rrd3zb1EVzH/data.json?page=2&pageSize=10";
    
    var user_name = api_caller.dhis2.api_user;
    var password = api_caller.dhis2.api_pwd;

    if (typeof(api_url) !== "undefined" && api_url
        && typeof(user_name) !== "undefined" && user_name
        && typeof(password) !== "undefined" && password) {
        requestTest(api_url, user_name, password, function (body) {

            if (body.indexOf("HTTP Status 401 - Bad credentials") > -1) {
                res.send("FAILED");
            } else {
                var data=JSON.parse(body);

                var sql=`TRUNCATE facilities;`;;

                //res.json(data['rows'])
                let facilities=[]

                let id=0;

                data['rows'].forEach(row =>

                    sql+=`INSERT INTO facilities (regionName,districtName,FacilityCode,Name) VALUES("`+row[0]+`","`+row[2]+`","`+row[7]+`","`+row[6]+`");`
                );
                db.query(sql,function(error,results){
                    if(error)throw error;
                    res.sendStatus(200);
                })
                //console.log(sql);
            }
        }, function (err) {
            res.send("ERROR");
        });
    } else {
        res.send("FIELD_REQUIRED");
    }
});

router.get('/import_treatments_from_dhis2', function (req, res) {
    //de:dataelement
    //pe:period
    //ou:org unit
    
    //curl "https://play.dhis2.org/demo/api/dataValues?de=s46m5MS0hxu&pe=201301&ou=DiszpKrYNg8&co=Prlt0C1RF0s&value=12"
    //-X POST -u admin:district -v
    var url = "dataElements.json?paging=false";

    if (typeof(api_caller.dhis2.api_url+url) !== "undefined" && api_caller.dhis2.api_url+url
        && typeof(api_caller.dhis2.api_user) !== "undefined" && api_caller.dhis2.api_user
        && typeof(api_caller.dhis2.api_pwd) !== "undefined" && api_caller.dhis2.api_pwd) {
        requestTest(api_caller.dhis2.api_url+url, api_caller.dhis2.api_user, api_caller.dhis2.api_pwd, function (body) {

            if (body.indexOf("HTTP Status 401 - Bad credentials") > -1) {
                res.send("FAILED");
            } else {
                var data=JSON.parse(body);

                var sql="DELETE FROM treatments WHERE imported=1;";

                let treatments=[]

                let id=0;

                data.dataElements.forEach(row =>

                    sql+=`INSERT INTO treatments (Treatment,imported,code,Ratio) VALUES("`+row.displayName+`",1,"`+row.id+`",1);`
                );
                db.query(sql,function(error,results){
                    if(error)throw error;
                    //res.status(200);
                    res.sendStatus(200);
                })
            }
        }, function (err) {
            res.send("ERROR");
        });
    } else {
        res.send("FIELD_REQUIRED");
    }
});

router.post('/import_values', function (req, res) {
    //de:dataelement
    //pe:period
    //ou:org unit
    
    //curl "https://play.dhis2.org/demo/api/dataValues?de=s46m5MS0hxu&pe=201301&ou=DiszpKrYNg8&co=Prlt0C1RF0s&value=12"
    //-X POST -u admin:district -v
    let year=req.body.selectedPeriod;
    let facilityId=req.body.facilityId;
    let cadreId=req.body.cadreId;
    let months=["01","02","03","04","05","06","07","08","09","10","11","12"];

    db.query(`SELECT t.code as code FROM treatmentsteps ts,treatments t
                     WHERE ts.CadreId =`+cadreId+` AND t.Id=ts.TreatmentId`,function(error,results,fields){
                            if(error) throw error;
                            let treatments={};
                            results.forEach(row => {

                                //let de="tTK7nV64EvX";
                                let de=row['code'];
                                //Seek dataelementgroup and dataset for the dataelement [code]

                                let url = "dataElements/"+de+".json";

                                if (typeof(api_caller.dhis2.api_url+url) !== "undefined" && api_caller.dhis2.api_url+url
                                    && typeof(api_caller.dhis2.api_user) !== "undefined" && api_caller.dhis2.api_user
                                    && typeof(api_caller.dhis2.api_pwd) !== "undefined" && api_caller.dhis2.api_pwd) {

                                    requestTest(api_caller.dhis2.api_url+url, api_caller.dhis2.api_user, api_caller.dhis2.api_pwd, function (body) {

                                            if (body.indexOf("HTTP Status 401 - Bad credentials") > -1) {
                                                res.send("FAILED");
                                            } else {
                                                var data=JSON.parse(body);

                                                var dataSetElement=data['dataSetElements'];

                                                var dataSet=dataSetElement[0].dataSet.id;

                                                var dataElementGroup=data['dataElementGroups'][0].id;

                                                let i=0;

                                                global.sum=0;

                                                for(i=0;i<months.length;i++){

                                                    let period=year+months[i];

                                                    let url = "dataValues?dataSet="+dataSet+"&dataElementGroup="+dataElementGroup+"&de="+de+"&pe="+period+"&ou="+facilityId;

                                                    requestTest(api_caller.dhis2.api_url+url, api_caller.dhis2.api_user, api_caller.dhis2.api_pwd, function (body) {

                                                        if (body.indexOf("HTTP Status 401 - Bad credentials") > -1) {
                                                            res.send("FAILED");
                                                        } else {
                                                            var data=JSON.parse(body);
                                                            
                                                            sum+=tryparse.int(data);

                                                            //console.log(sum);
                                                        }
                                                        
                                                    }, function (err) {
                                                        res.send("ERROR");
                                                    });
                                                }
                                                console.log(sum);
                                                
                                                
                                            }
                                        }, function (err) {
                                            res.send("ERROR");
                                    });


                                /*let url = "dataValues?dataSet=pMbC0FJPkcm&dataElementGroup=QSElAHIYbOU&de=tTK7nV64EvX&pe="+year+"&ou=hBZBKFxwpx7";

                                if (typeof(api_caller.dhis2.api_url+url) !== "undefined" && api_caller.dhis2.api_url+url
                                    && typeof(api_caller.dhis2.api_user) !== "undefined" && api_caller.dhis2.api_user
                                    && typeof(api_caller.dhis2.api_pwd) !== "undefined" && api_caller.dhis2.api_pwd) {

                                    for(var i=0;i<months.length;i++){
                                        let period=year+months[i];
                                        let url = "dataValues?dataSet=pMbC0FJPkcm&dataElementGroup=QSElAHIYbOU&de=tTK7nV64EvX&pe="+period+"&ou=hBZBKFxwpx7";
                                        //console.log(period+months[i]);
                                        requestTest(api_caller.dhis2.api_url+url, api_caller.dhis2.api_user, api_caller.dhis2.api_pwd, function (body) {

                                            if (body.indexOf("HTTP Status 401 - Bad credentials") > -1) {
                                                res.send("FAILED");
                                            } else {
                                                var data=JSON.parse(body);
                                
                                                console.log(period+": "+data);
                                            }
                                        }, function (err) {
                                            res.send("ERROR");
                                        });
                                    }*/
                                    
                                    
                                } else {
                                    res.send("FIELD_REQUIRED");
                                }
                            });
                            //res.json(treatments);
                            console.log(treatments);
    });

});


router.post('/import/:sql', (req, res) => {

    var sql=req.params.sql.toString();

    db.query(sql,function(error,results){
            if(error)throw error;

            res.json(results);
                        
    });
});

function importdata(query,results,next){
  
    const db=require('../dbconn')
    //var sql=req.params.sql.toString();
    db.query(query,function(error,results){
        if(error)throw error;

        res.json(results);
                    
});
}

function requestTest(api_url, user_name, password, success, error) {
    var request = require('request');
    var username = user_name;
    var password = password;
    var options = {
        url: api_url,
        auth: {
            user: username,
            password: password
        }
    };

    request(options, function (err, res, body) {
        if (err) {
            error(err);
            return;
        }
        success(body);
        
        return;
    });
}
module.exports = router;