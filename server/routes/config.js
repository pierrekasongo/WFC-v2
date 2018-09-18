var config={};

config.ihris={};
config.dhis2={};

config.ihris.server='http://192.168.1.29/';
config.ihris.hr_report_name='hr_report.csv';
config.ihris.cadre_report_name='cadre_report.csv';


config.dhis2.server='';
config.dhis2.user='';
config.dhis2.password='';
config.dhis2.facility_report_name='';
config.dhis2.treatments_report_name='';
config.dhis2.treatments_data_report_name='';


config.dhis2.api_url="https://www.snisrdc.com/api/";
config.dhis2.api_user="Pierre_Kasongo";
config.dhis2.api_pwd="ABC@bc2018";
/*config.api_connector={

    api_url:"https://www.snisrdc.com/api/",
    user_name:"Pierre_Kasongo",
    password:"ABC@bc2018"

}*/
module.exports=config;
