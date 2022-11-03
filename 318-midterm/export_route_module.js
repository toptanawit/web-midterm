var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'midterm'
});

router.route('/download/academic/:id')
.get((req,res)=>{
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
        connection.query(
            'select * from files where id = ?',
            [req.params.id],
            (err, results)=>{
                if (results) {
                    res.download(path.join(__dirname+'/public/assets', results[0].filename));
                }
            }
        );
    } else {
        res.redirect('/login')
    }
});

// router.route('/download/academic2')
// .get((req,res)=>{
//     if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
//         res.download(path.join(__dirname, '/public/assets/academic2.pdf'));
//     } else {
//         res.redirect('/login')
//     }
// });

// router.route('/download/academic3')
// .get((req,res)=>{
//     if (req.session.isLoggedIn != null && req.session.isLoggedIn == true) {
//         res.download(path.join(__dirname, '/public/assets/academic3.pdf'));
//     } else {
//         res.redirect('/login')
//     }
// });

module.exports = router;