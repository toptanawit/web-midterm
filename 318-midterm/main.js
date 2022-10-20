var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));
const HandyStorage = require('handy-storage');
 
const storage = new HandyStorage({
    beautify: true
});

storage.connect('./message.json');

const session = require('express-session');
app.use(session({
    secret: 'COSCI', cookie: { maxAge: 60000000 },
    resave: true, saveUninitialized: false
}));

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, "/public/login.html"));  
});

app.post('/authen', (req, res)=>{
    const _username = req.body.username;
    const _password = req.body.password;

    if (req.session.isLoggedIn != null && req.session.isLoggedIn == true){
        res.redirect("/academic");
    }

    if (req.body.username == "admin" && req.body.password == "Web999"){
        req.session.username = req.query.username;
        req.session.isLoggedIn = true;
        res.redirect("/academic");
    } else if (req.body.username == "commu" && req.body.password == "Cosci7749") {
        req.session.username = req.query.username;
        req.session.isLoggedIn = true;
        res.redirect("/academic");
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

    res.redirect('/contact');
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