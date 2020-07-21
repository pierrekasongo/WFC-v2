const router = require('express').Router();
const path = require('path')

router.get('/',function(req,res){

    res.sendFile(`${__dirname}${path.sep}doc.html`);
})

module.exports = router;