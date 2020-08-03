const db = require('../dbconn');

var config = {};

config.ihris = {};
config.dhis2 = {};

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
