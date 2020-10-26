const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser=require('cookie-parser')
const cors = require('cors');

require("dotenv").config();

// start db
const db=require('./dbconn');

// import our routes
//const user=require('./routes/user');
//const admin = require('./routes/admin');
const facility=require('./routes/facility');
const cadre=require('./routes/cadre');
const staff=require('./routes/staff');
const configuration=require('./routes/configuration');
const auth=require('./routes/auth');
const metadata=require('./routes/metadata');
const treatment=require('./routes/treatment');
const countrycadre=require('./routes/country_cadres');
//const countrytreatment=require('./routes/country_treatments');
const countrystatistics=require('./routes/country_statistics');
const dashboard = require('./routes/dashboard');


//External API
const API_doc=require('./routes/docs/api_doc');
const API_staff=require('./routes/staff');
const API_statistics=require('./routes/country_statistics');
const API_facility= require('./routes/facility');
const API_activity=require('./routes/treatment');
const API_cadre=require('./routes/cadre');

// create app server
let app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(cors());

// middleware to parse request info into JSON
//app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
//app.use(bodyParser.json()); // application/json
app.use(express.json());
app.use(cookieParser());
// serve static files in public folder
app.use(express.static(path.join(__dirname, "../", "public")));

// use our routes http://localhost:3000/api/user
//app.use('/api/user', user);
//app.use('/api/admin', admin);
app.use('/api/facility',facility);
app.use('/api/cadre',cadre);
app.use('/api/staff', staff);
app.use('/api/configuration',configuration.router);
app.use('/api/auth',auth);
app.use('/api/metadata',metadata);
app.use('/api/treatment',treatment);
app.use('/api/countrycadre',countrycadre);
//app.use('/api/countrytreatment',countrytreatment);
app.use('/api/countrystatistics',countrystatistics);
app.use('/api/dashboard',dashboard);

//External API
app.use('/api/v1',API_doc);
app.use('/api/v1/staff',API_staff);
app.use('/api/v1/statistics',API_statistics);
app.use('/api/v1/facility',API_facility);
app.use('/api/v1/activity',API_activity);
app.use('/api/v1/cadre',API_cadre);
// instead of 404, redirect to index page
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public", "index.html"));
})


let PORT = process.env.SERVER_LISTEN_PORT || 3000;
// start listening for requests
app.listen(PORT,process.env.SERVER_LISTEN_ADDRESS, () => {
    console.log(`Listening on ${process.env.SERVER_LISTEN_ADDRESS}:${PORT}`);
});