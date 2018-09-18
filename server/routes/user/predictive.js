const sql = require('mysql');
const base64url = require('base64-url')

const LinearRegression = require('./predictive-lib/linear_regression').LinearRegression;
const euclideanDistance = require('./predictive-lib/distance').euclidean;
const KMeans = require('./predictive-lib/k_means').KMeans;

var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
let router = require('express').Router();

const db=require('../../dbconn');

// get list of indicators
router.get('/lrcharts/indicators', function(req, res) {
        db.query(`SELECT k.tagword, t.Indicator_Name as indicator
                FROM keyWords k, (select * from WDIData where Country_Code = 'CD') as t
                WHERE t.Indicator_Name LIKE CONCAT('%',k.tagword,'%')`,function(error,results,fields){
                    if(error)throw error;
                    let tagwords={};

                    results.forEach(row => {
                        if (tagwords[row['tagword']] == null) {
                            tagwords[row['tagword']] = [];
                        }
                        tagwords[row['tagword']].push(row['indicator']);
                    });
                    res.json(tagwords);
                    //res.send(JSON.stringify({tagwords}));
                });
        
});


/*get all the rows/relevant records related to healthcare categories for LR chart
------ x-axis = will be years [2000 - 2016] | predict[upto 2020] : FIXED
------ y-axis = will be the numbers values : need to edit */
router.get('/lrcharts/:indicator', function(req, res){
    
    //let indicator = base64url.decode(req.params.indicator);


        var indicator=req.params.indicator.toString();
        
        db.query(`SELECT wd.2000, wd.2001, wd.2002, wd.2003, wd.2004,
        wd.2005, wd.2006, wd.2007, wd.2008,wd.2009, wd.2010,
        wd.2011, wd.2012, wd.2013, wd.2014, wd.2015, wd.2016 FROM WDIData wd
                WHERE Country_Code = 'CD' 
                    AND Indicator_Name LIKE "`+indicator+`"`,function(error,results){

            if(error)throw error;
            var data=results[0];
            // remove zero value/ years
            var available_years = [] // x-axis
            var available_value = [] // y-axis
            for (var i = 0; i < years.length; i++) {
                if (data['' + years[i] + ''] != 0) {
                    available_years.push(years[i])
                    available_value.push(data['' + years[i] + ''])
                }
            }

            // Initialize and train the linear regression
            var lr = new LinearRegression(available_years, available_value);
            lr.train(function (err) {
                if (err) {
                    console.log('error', err);
                    process.exit(2);
                }
            });

            // Use the linear regression function to get a set of data to graph the linear regression line
            var y2 = [];
            x2 = [2017, 2018, 2019, 2020]
            x2.forEach(function (xi) {
                y2.push(lr.predict(xi));
            });

            res.json({
                series1: {
                    x: available_years,
                    y: available_value
                },
                series2: {
                    x: x2,
                    y: y2
                }
            });
        });
});


module.exports = router;