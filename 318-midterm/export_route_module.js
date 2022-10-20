var express = require('express');
var router = express.Router();
var path = require('path');

router.route('/download/academic1')
.get((req,res)=>{
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
        res.download(path.join(__dirname, '/public/assets/academic1.pdf'));
    } else {
        res.redirect('/login')
    }
});

router.route('/download/academic2')
.get((req,res)=>{
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
        res.download(path.join(__dirname, '/public/assets/academic2.pdf'));
    } else {
        res.redirect('/login')
    }
});

router.route('/download/academic3')
.get((req,res)=>{
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
        res.download(path.join(__dirname, '/public/assets/academic3.pdf'));
    } else {
        res.redirect('/login')
    }
});

module.exports = router;