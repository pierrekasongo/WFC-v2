const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser=require('cookie-parser')

// start db
const db=require('./dbconn');

// import our routes
//const user=require('./routes/user');
const admin = require('./routes/admin');
const dhis2=require('./routes/dhis2');
const hris=require('./routes/hris');
const configuration=require('./routes/configuration');
const auth=require('./routes/auth');
const metadata=require('./routes/metadata');
const countrycadre=require('./routes/country_cadres');
const countrytreatment=require('./routes/country_treatments');
const countrystatistics=require('./routes/country_statistics');
// create app server
let app = express();

// middleware to parse request info into JSON
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(cookieParser());
// serve static files in public folder
app.use(express.static(path.join(__dirname, "../", "public")));

// use our routes http://localhost:3000/api/user
//app.use('/api/user', user);
app.use('/api/admin', admin);
app.use('/api/dhis2/',dhis2);
app.use('/api/hris', hris);
app.use('/api/configuration',configuration);
app.use('/api/auth',auth);
app.use('/api/metadata',metadata);
app.use('/api/countrycadre',countrycadre);
app.use('/api/countrytreatment',countrytreatment);
app.use('/api/countrystatistics',countrystatistics);
// instead of 404, redirect to index page
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public", "index.html"));
})

// start listening for requests
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
