const db = require('../dbconn');

var config = {};

config.ihris = {};
config.dhis2 = {};

/*config.ihris.server = getConfig("URL_iHRIS") + "/";
config.ihris.hr_report_name = getConfig("HR_FILENAME");
config.ihris.cadre_report_name = getConfig("CADRE_FILENAME");



config.dhis2.api_url = getConfig("URL_DHIS2") + "/api/";
config.dhis2.api_user = getConfig("DHIS2_USER"); 
config.dhis2.api_pwd = getConfig("DHIS_PWD");
config.dhis2.facility_sqlView=getConfig("DHIS_FACILITY_SQLVIEW");*/

function getConfig(param) {

    let countryId = 52;//Get this from session

    db.query(`SELECT id, parameter, value FROM  config WHERE parameter="` + param +
        `" AND country_id =` + countryId,
        function (error, results, fields) {

            if (error) throw error;
            return results[0].value;
        });
}

module.exports = config;
