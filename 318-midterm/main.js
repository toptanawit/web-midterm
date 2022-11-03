var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));
const HandyStorage = require('handy-storage');
var mysql = require('mysql');
const session = require('express-session');
 
app.set('views', path.join(__dirname+'/public', 'views'));
app.set('view engine', 'ejs');

const storage = new HandyStorage({
    beautify: true
});

storage.connect('./message.json');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'midterm'
});

app.use(session({
    secret: 'COSCI', cookie: { maxAge: 60000000 },
    resave: true, saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, "/public/login.html"));  
});

app.get('/register', (req,res)=>{
    res.sendFile(path.join(__dirname, "/public/register.html"));  
});

app.post('/register', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const post = {
        username: username,
        password: password,
    };
    connection.query('insert into users set ?', post, (err)=>{
        console.log('Registered Successfully');
    });
    res.redirect('/login');
});

app.post('/authen', (req, res)=>{
    var username = req.body.username;
    var password = req.body.password;

    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true){
        res.redirect("/academic");
    }

    if (username && password) {
        connection.query(
            "select * from users where username = ? and password = ?",
            [username, password],
            (error, results, fields)=>{
                if (results.length > 0) {
                    req.session.isLoggedIn = true;
                    req.session.username = username;
                    res.redirect('/academic');
                } else {
                    res.sendFile(path.join(__dirname, "/public/relogin.html"));
                }
            }
        );
    } else {
        res.sendFile(path.join(__dirname, "/public/relogin.html"));
    }
});

app.get('/academic', function(req, res){
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true){
        res.sendFile(path.join(__dirname, "/public/academic.html"));    
    }else{
      res.redirect("/login");
    }  
});

app.get('/read', function(req, res){
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true){
        res.sendFile(path.join(__dirname, "/public/read.html"));    
    }else{
      res.redirect("/login");
    }  
});

app.get('/dbread', function(req, res){
    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true){
        connection.query('select * from users', (err, result)=>{
            res.render('dbread.ejs', {
                posts: result
            });
        }); 
    }else{
      res.redirect("/login");
    }  
});

app.get('/edit/:id', (req, res)=>{
    const edit_postID = req.params.id;

    connection.query(
        'select * from users where id = ?',
        [edit_postID],
        (err, results)=>{
            if (results) {
                res.render('dbedit.ejs', {
                    post: results[0]
                });
            }
        }
    );
});

app.post('/edit/:id', (req, res)=>{
    const update_username = req.body.username;
    const update_password = req.body.password;
    const id = req.params.id;

    connection.query(
        'update users set username = ?, password = ? where id = ?',
        [update_username, update_password, id],
        (err, results)=>{
            if (results.changedRows === 1) {
                console.log('Post Updated');
            }
            return res.redirect('/dbread');
        }
    );
});

app.get('/delete/:id', (req, res)=>{
    connection.query(
        'delete from users where id = ?',
        [req.params.id],
        (err, results)=>{
            return res.redirect('/dbread');
        }
    );
});


app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect("/home");  
});

var router = require('./export_route_module');
app.use('',router);

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

app.get('/contact', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/contact.html"));
});

app.get('/gallery', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/gallery.html"));
});

app.post('/form', (req, res)=>{
    const _name = req.body.name;
    const _email = req.body.email;
    const _subject = req.body.subject;
    const _message = req.body.message;

    storage.setState({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })

    res.redirect('/success');
});

app.get('/success', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/success.html"));
});

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get('/error', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/notfound.html"));
});

app.get('*', (req, res)=>{
    res.redirect('/error')
});

var server = app.listen(5005, ()=>{
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at htttp://%s%s", host, port);
});